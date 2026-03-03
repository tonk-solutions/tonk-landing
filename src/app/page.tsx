import { getFrontmatterOnly } from '@/lib/mdx-content';
import { PageContent } from './PageContent';

export default async function Home() {
  const [hero, navigation, services, about, team, contact] = await Promise.all([
    getFrontmatterOnly('hero'),
    getFrontmatterOnly('navigation'),
    getFrontmatterOnly('services'),
    getFrontmatterOnly('about'),
    getFrontmatterOnly('team'),
    getFrontmatterOnly('contact'),
  ]);

  return (
    <PageContent
      hero={hero ?? {}}
      navigation={navigation ?? {}}
      services={services ?? {}}
      about={about ?? {}}
      team={team ?? {}}
      contact={contact ?? {}}
    />
  );
}
