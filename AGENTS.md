# AGENTS.md — tonk-landing

Reglas del repositorio para agentes y contribuciones. Aplican a todo el árbol, en
cualquier rama.

## Autoría de commits y PRs hacia `main`

**Regla.** Todo lo que llega a `main` va a nombre de Rodrigo Hernandez, y los PRs
que apuntan a `main` se abren desde esa cuenta. Motivo: el deploy de Netlify se
gestiona con esa cuenta.

Identidad exacta — no varíes el nombre ni el email:

```text
Rodrigo Hernandez <39744836+rodrigoenzohernandez@users.noreply.github.com>
```

### Commits

Se fija por commit, con `--author`, sin tocar la configuración del clon:

```bash
git commit \
  --author="Rodrigo Hernandez <39744836+rodrigoenzohernandez@users.noreply.github.com>" \
  -m "feat(landing): …"
```

Si la rama ya tiene commits con otra autoría, se reescriben antes del merge:

```bash
GIT_SEQUENCE_EDITOR=: git rebase -i <base> \
  --exec 'git commit --amend --no-edit --author="Rodrigo Hernandez <39744836+rodrigoenzohernandez@users.noreply.github.com>"'
```

No cambies `git config user.name` ni `user.email`: esa configuración es del clon y
la comparten todos los worktrees, así que afectaría a otras ramas y sesiones. Por
eso la autoría se fija con `--author`, commit por commit.

### PRs

- Se crean con la cuenta de Rodrigo (`gh pr create` con el `GH_TOKEN` de esa
  cuenta), nunca desde una cuenta personal.
- Merge con squash: el commit que queda en `main` es único y hereda la autoría del
  PR. Es la forma más simple de cumplir la regla cuando la rama trae commits de
  varias personas.
- Merge con merge commit: el commit de merge también va a nombre de Rodrigo.

### Verificación antes de mergear

```bash
git log --format='%an <%ae>' origin/main..HEAD | sort -u
npm run check:authors
```

Todo lo que no sea la identidad de arriba se reescribe antes del merge. Después de
un rebase o un amend, actualizá los hashes que cites en documentos: un hash
reescrito deja la evidencia apuntando a commits inalcanzables.

## Cómo se hace cumplir

El guard está versionado en `.githooks/` y la lógica vive en
`scripts/check-authors.mjs`, que es la misma que corre el comando manual.

| Hook | Cuándo bloquea |
|---|---|
| `pre-commit` | Commiteás estando en `main` y la autoría que se va a registrar (`--author` o la config) no es la de Rodrigo. |
| `pre-push` | Empujás commits nuevos a `refs/heads/main` con otra autoría, por ejemplo después de mergear localmente una rama con commits ajenos. |

Se activan una vez por clon (los hooks no viajan con el repo):

```bash
npm run setup:hooks
```

`core.hooksPath` es relativo al toplevel de cada worktree, así que la regla cubre
todos tus worktrees de este clon sin configuración extra.

Límites conocidos, para no confiar de más en el guard:

- GitHub no ejecuta hooks locales: el squash merge de un PR cuyo autor no sea
  Rodrigo no lo detecta el guard. Para ese caso manda la regla de PRs.
- La primera publicación de `main` en un remoto no tiene rango contra el cual
  comparar, así que el `pre-push` avisa y deja pasar.
- Un clon sin `npm run setup:hooks` no está protegido. Verificá con
  `git config --get core.hooksPath`.

## Contexto del proyecto

Build, rutas y estructura: [`README.md`](./README.md).
