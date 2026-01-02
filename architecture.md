# SigmaSoft Backend — Architecture

## 1. Visão Geral

O **SigmaSoft Backend** é uma API REST desenvolvida em **NestJS + TypeScript**, projetada para atender um catálogo digital (Ruah Joias) com foco em **escala**, **organização por domínio** e **evolução incremental**.

A arquitetura separa claramente:
- **Domínio de negócio (Catálogo)**
- **Autenticação e Autorização**
- **CMS Institucional (Home / Sobre)**

O backend foi construído para integrar-se de forma desacoplada com um frontend SPA (React), expondo contratos claros via REST e documentação Swagger.

---

## 2. Stack Tecnológica

### Backend
- Node.js
- TypeScript
- NestJS
- TypeORM
- MySQL
- JWT (Auth)

### Infra / Dev
- Docker / Docker Compose
- Swagger (OpenAPI)
- Postman (Collections de teste)

---

## 3. Organização de Pastas

```txt
src/
├── modules/
│   ├── auth/          # Autenticação (JWT)
│   ├── users/         # Usuários do sistema
│   ├── roles/         # Perfis de acesso
│   ├── categories/    # Categorias de produtos
│   ├── products/      # Produtos do catálogo
│   ├── about/         # CMS - Sobre a empresa
│   └── home/          # CMS - Home (banners e destaques)
│
├── app.module.ts
├── main.ts
└── ...
```

Cada módulo segue o padrão:
- `entity`
- `dto`
- `controller`
- `service`
- `module`

---

## 4. Domínios do Sistema

### 4.1 Autenticação e Autorização

**Auth**
- Login via email e senha
- JWT com expiração (30 minutos)
- Guards para proteção de rotas

**Users**
- Cadastro e gestão de usuários
- Associação a Roles

**Roles**
- Perfis de acesso (ex: ADMIN, EDITOR)

---

### 4.2 Catálogo

**Categories**
- Organização dos produtos

**Products**
- Nome, descrição, preço
- Flag de destaque (isBestSeller)
- Relacionamento com Category

**ProductImages**
- Galeria de imagens
- Imagem principal
- Ordenação

---

### 4.3 CMS Institucional

**About**
- Conteúdo institucional
- Texto curto (Home)
- Texto completo (Página Sobre)
- Imagem e vídeo

**Home**
- Banners (carrossel)
- Destaques (highlights)
- Conteúdo dinâmico controlado pelo Admin

---

## 5. DER — Modelo de Relacionamentos

### Entidades Principais

- Role
- User
- Category
- Product
- ProductImage
- AboutContent
- HomeBanner
- HomeHighlight

### Relacionamentos

- Role 1:N User
- Category 1:N Product
- Product 1:N ProductImage
- Entidades CMS são independentes

---

## 6. Segurança

- JWT com Bearer Token
- Guards por Controller
- Rotas públicas apenas para frontend (Home, About, Catálogo)
- Rotas administrativas protegidas

---

## 7. Integração com Frontend

| Área | Endpoint |
|----|----|
| Home | GET /home |
| Sobre | GET /about |
| Catálogo | GET /products |
| Produto | GET /products/:id |
| Relacionados | GET /products/:id/related |
| Auth | POST /auth/login |

---

## 8. Evoluções Planejadas

- Refresh Token
- Upload real de imagens (Cloudinary / S3)
- RoleGuard (ADMIN / EDITOR)
- Paginação e performance
- Admin UI

---

## 9. Conclusão

O SigmaSoft Backend foi projetado para ser:
- Modular
- Escalável
- Manutenível
- Alinhado ao frontend real

Servindo como base sólida para evolução do produto.

