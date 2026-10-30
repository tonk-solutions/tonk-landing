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
```

Todo lo que no sea la identidad de arriba se reescribe antes del merge. Después de
un rebase o un amend, actualizá los hashes que cites en documentos: un hash
reescrito deja la evidencia apuntando a commits inalcanzables.

## Contexto del proyecto

Build, rutas y estructura: [`README.md`](./README.md).
