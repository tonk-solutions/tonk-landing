# ts-nextjs-app-router.md
> Tipado estricto para convenciones de Next.js 15 App Router.

## RULE-001 — `params` y `searchParams` son `Promise<...>` en Next.js 15
```typescript
// ❌ Next.js 14 y anterior — params como objeto directo
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // ❌ Error en Next.js 15
}

// ✅ Next.js 15 — siempre Promise + await
type PageProps = {
  params:       Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id }     = await params;
  const { sort }   = await searchParams;
}

// ✅ generateMetadata también awaita params
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Product ${id}` };
}
```

## RULE-002 — Route Handlers con `NextRequest` y return type explícito
```typescript
// ❌ Tipos legacy — NextApiRequest/NextApiResponse son para Pages Router
export async function GET(req: NextApiRequest, res: NextApiResponse) { }

// ✅ App Router — NextRequest + NextResponse con return type
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const data   = await fetchData(id);
  return NextResponse.json(data);
}
```

## RULE-003 — `request.json()` siempre como `unknown` + Zod
```typescript
// ❌ request.json() retorna any — se usa sin validación
export async function POST(request: NextRequest) {
  const body = await request.json();
  await createUser(body.email, body.name); // sin type safety
}

// ✅ unknown + Zod safeParse
const CreateSchema = z.object({ email: z.string().email(), name: z.string().min(1) });

export async function POST(request: NextRequest): Promise<NextResponse> {
  const raw: unknown = await request.json();
  const parsed = CreateSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const user = await createUser(parsed.data);
  return NextResponse.json(user, { status: 201 });
}
```

## RULE-004 — Server Actions con tipo de retorno serializable
```typescript
'use server';

// ❌ Error objects no son serializables a través del network boundary
export async function createItem(fd: FormData): Promise<{ user: User } | Error> { }

// ✅ Discriminated union serializable
type ActionResult<T = void> =
  | { success: true;  data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createItem(fd: FormData): Promise<ActionResult<Item>> {
  const parsed = ItemSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const item = await db.item.create({ data: parsed.data });
  return { success: true, data: item };
}
```

## RULE-005 — Nunca `React.FC` — no soporta Server Components async
```typescript
// ❌ React.FC no puede ser async — incompatible con Server Components
const UserCard: React.FC<{ id: string }> = async ({ id }) => { }

// ✅ Función tipada directamente
async function UserCard({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return null;
  return <div>{user.name}</div>;
}

// ✅ Client Component también sin React.FC
'use client';
function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## RULE-006 — Layouts reciben `children: React.ReactNode`
```typescript
// ✅ Layout con múltiples slots
type RootLayoutProps = {
  children:  React.ReactNode;
  params?:   Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const locale = params ? (await params).locale : 'en';
  return <html lang={locale}><body>{children}</body></html>;
}
```
