# Agentic Coding Hands-on

Repository phục vụ khóa thực hành **Agentic Coding** nội bộ Sun\*. Học viên sẽ sử dụng **MoMorph + Claude Code** để generate code từ Figma design.

## Branches

Repository có 2 branch:

- **`main`** — Source code khởi tạo ban đầu. Học viên clone về và làm trên nhánh này. Cần tự cài đặt MoMorph CLI và chạy `momorph init` để sinh ra các thư mục `.claude`, `.vscode` (chứa prompts) kết nối với MoMorph MCP Server.
- **`sample`** — Có sẵn các thư mục `.claude`, `.vscode`, `.momorph` chứa specs mẫu của một số màn hình. Dùng để tham khảo khi muốn xem context đầu vào và kết quả mà MoMorph sinh ra trông như thế nào.

## Prerequisites

- Node.js v24.x
- Docker (for running Supabase)
- Yarn v1.22.22 (package manager)
- [MoMorph CLI](https://github.com/momorph/cli)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) hoặc VSCode + MoMorph Extension

### Tech Stack

- **Next.js** – React framework for building full-stack web applications
- **Supabase** – Backend-as-a-Service (BaaS) platform providing database, authentication, and real-time features
- **Cloudflare Workers** – Edge computing platform for deploying and running applications
- **TailwindCSS** – Utility-first CSS framework

## Hướng dẫn thực hành

### Bước 1: Clone repository

```sh
git clone https://github.com/sun-asterisk-internal/agentic-coding-hands-on.git
cd agentic-coding-hands-on
```

### Bước 2: Cài đặt dependencies

```sh
# Tạo file .env:
cp .env.example .env

# Cài đặt packages:
yarn install
```

### Bước 3: Đăng nhập MoMorph Web và kết nối tài khoản GitHub

1. Truy cập [MoMorph Web](https://momorph.ai/) và đăng nhập bằng tài khoản Figma (dùng email `*@sun-asterisk.com`).
2. Điền link file Figma sau để tiếp tục: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding
3. Vào **Settings → GitHub → Connect** để kết nối tài khoản GitHub của bạn với MoMorph.
4. Chọn repository `sun-asterisk-internal/agentic-coding-hands-on` để liên kết.

> **Lưu ý:** Repository này đã được connect sẵn với MoMorph và Figma project trên hệ thống. Bạn chỉ cần kết nối tài khoản GitHub cá nhân với MoMorph là có thể sử dụng.

### Bước 4: Đặt git remote trỏ đúng repository

Đảm bảo git remote của repo trên local trỏ tới repository gốc:

```sh
git remote set-url origin https://github.com/sun-asterisk-internal/agentic-coding-hands-on.git
```

Điều này cần thiết để MoMorph VSCode Extension có thể nhận diện repository và hiển thị Figma file đã liên kết.

### Bước 5: Cài đặt MoMorph CLI

Chọn một trong các cách sau:

```sh
# macOS / Linux (Homebrew):
brew install momorph/tap/momorph-cli

# Windows (Chocolatey):
choco install momorph

# Windows (PowerShell):
irm https://raw.githubusercontent.com/momorph/cli/refs/heads/main/scripts/install.ps1 | iex

# Linux / macOS (Bash):
curl -fsSL https://raw.githubusercontent.com/momorph/cli/refs/heads/main/scripts/install.sh | bash
```

Xác nhận cài đặt thành công:

```sh
momorph version
```

### Bước 6: Đăng nhập MoMorph CLI

```sh
momorph login
```

CLI sẽ hiển thị một mã xác thực và link đăng nhập. Nhấn `Enter` để mở link trên trình duyệt, sau đó nhập mã để hoàn tất xác thực.

Kiểm tra thông tin tài khoản:

```sh
momorph whoami
```

### Bước 7: Khởi tạo MoMorph project

Chạy lệnh init để sinh ra các thư mục cấu hình (`.claude`, `.vscode` prompts, kết nối MCP server...):

```sh
# Nếu dùng Claude Code:
momorph init . --ai claude

# Nếu dùng GitHub Copilot:
momorph init . --ai copilot

# Nếu dùng Cursor:
momorph init . --ai cursor
```

Lệnh này sẽ:
- Tải template MoMorph project mới nhất
- Sinh các file cấu hình (`.claude/`, prompt files, workflow scripts...)
- Thiết lập kết nối MCP server cho AI agent đã chọn

### Bước 8: (Tùy chọn) Cài đặt MoMorph VSCode Extension

Nếu sử dụng VSCode + GitHub Copilot, cài thêm MoMorph Extension:

```sh
# Cài đặt qua script (không khả dụng với macOS):
curl -sSfL https://morpheus-vscode.sun-asterisk.ai/install.sh | CHANNEL=stable bash -
```

Hoặc cài đặt bằng file `.vsix` nhận từ đội phát triển (xem mục "Bản đóng gói extension" trong tài liệu hướng dẫn).

Sau khi cài đặt, mở source code repo → click vào biểu tượng MoMorph trên sidebar → bạn sẽ thấy danh sách frame list của Figma file đã liên kết.

### Bước 9: Bắt đầu generate code

Sử dụng Figma project để thực hành:

**Figma file:** [SAA 2025 - Internal Live Coding](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C/SAA-2025---Internal-Live-Coding)

Quy trình generate code với MoMorph (sử dụng slash commands trong AI agent):

1. **`/momorph.constitution`** — Khởi tạo coding standards và conventions cho project
2. **`/momorph.specify`** — Sinh specification từ Figma frame (spec.md + design-style.md)
3. **`/momorph.plan`** — Tạo implementation plan chi tiết
4. **`/momorph.tasks`** — Chia nhỏ plan thành danh sách task thực thi
5. **`/momorph.implement`** — Thực thi tasks, sinh code theo design

Ví dụ lệnh:

```
/momorph.specify
Build specifications for project based on the following Figma design items:
1. Signin – fileKey: 9ypp4enmFmdK3YAFJLIu6C, frameId: <frame-id>
```

### Bước 10: Chạy development server

```sh
# Khởi động local containers:
make up

# Chạy dev server:
make dev

# Dừng containers:
make down
```

## Tài liệu tham khảo

- [MoMorph CLI Documentation](https://sun-asterisk.enterprise.slack.com/docs/T02CQGZA7MK/F0A86NC88SK)
- [MoMorph MCP Server](https://sun-asterisk.enterprise.slack.com/docs/T02CQGZA7MK/F0A9HULD5D0)
- [MoMorph VSCode Extension](https://sun-asterisk.enterprise.slack.com/docs/T02CQGZA7MK/F094K2LTV71)
- [MoMorph Web](https://sun-asterisk.enterprise.slack.com/docs/T02CQGZA7MK/F092SAQBXR8)
