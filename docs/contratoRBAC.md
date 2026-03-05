# CONTRATO RBAC

### Users

- `id` PK, uuid, obrigatório
- `name` varchar, min 3 caracteres, obrigatório
- `email` UNIQUE, varchar, obrigatório
- `password.hash` varchar, min 8 caracteres, obrigatório

### User_role

- `role.id` FK, uuid, obrigatório
- `user.id` FK, uuid, obrigatório

### Role

- `id` PK, uuid, obrigatório
- `name` varchar, min 3 caracteres, obrigatório
- `description` text, regras adicionais

### Role_permission

- `role.id` FK, uuid, obrigatório
- `permission.id` FK, uuid, obrigatório

### Permissions

- `id` PK, uuid, obrigatório
- `key` varchar, min 3 caracteres, obrigatório
- `description` text, regras adicionais
