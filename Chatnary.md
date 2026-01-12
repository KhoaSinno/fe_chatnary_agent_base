# **📘 Business description: Chatnary RAG**

## **1\. TỔNG QUAN HỆ THỐNG**

Hệ thống là một nền tảng quản lý tri thức tập trung, kết hợp giữa **lưu trữ tài liệu truyền thống** và **trí tuệ nhân tạo (RAG)**. Điểm khác biệt cốt lõi là khả năng biến tài liệu tĩnh (PDF/DOCX) thành dữ liệu có thể tương tác (Chat/Hỏi đáp) và khả năng cộng tác nhóm trong các dự án học tập/nghiên cứu.

## ---

**2\. CHI TIẾT CHỨC NĂNG THEO ACTOR**

### **👤 ACTOR 1: NGƯỜI DÙNG (USER) \- Sinh viên, Giảng viên**

_Người sử dụng chính, tập trung vào khai thác dữ liệu và cộng tác._

#### **1.1. Quản lý tài khoản (Auth)**

- **Đăng ký/Đăng nhập:** Hỗ trợ Email/Password và SSO Google.
- **Profile:** Cập nhật thông tin cá nhân, avatar.

#### **1.2. Quản lý Tài liệu Cá nhân (My Library)**

- **Upload tài liệu:** Hỗ trợ định dạng PDF, DOCX.
  - _Logic:_ Hệ thống tự động đẩy vào hàng đợi xử lý AI (Queue) để OCR \-\> Chunking \-\> Embedding \-\> Lưu vào Vector DB.
  - _Trạng thái:_ Processing (Đang xử lý) \-\> Done (Sẵn sàng) \-\> Error(Lỗi).
- **Quản lý file:** Đổi tên, Xóa (Xóa file gốc \+ Xóa vector data tương ứng), Di chuyển vào thư mục.
- **Chia sẻ:** Tạo link chia sẻ (Public/Private) hoặc gửi quyền xem cho user khác.

#### **1.3. Quản lý Dự án & Cộng tác (Workspace \- TÍNH NĂNG MỚI)**

- **CRUD Project:** Ví dụ: "Nhóm NCKH Mùa Thu", color hex: `#FFFFFF`
- **Thêm tài liệu vào Project:**
  - Import từ "My Library" (Tài liệu cá nhân).
  - Link tài liệu thư viện công cộng vào kho của mình.
- **Mời thành viên (Member Invite):** Mời user khác vào Project qua email. Phân quyền: Viewer (Chỉ xem), Editor (Được upload thêm/chat).
- **Project Chat (Group Chat):**
  - Chat thời gian thực giữa các thành viên.
  - **@AI Mention:** Gõ @AI để hỏi bot ngay trong nhóm. AI sẽ trả lời dựa trên context là **tất cả tài liệu đang có trong Project này**.

#### **1.4. Chat & Hỏi đáp (RAG Core)**

- **Chat với phạm vi tài liệu trong project:** Mở file \-\> Khung chat bên cạnh \-\> Hỏi đáp chi tiết về nội dung project đó.
- **Chat tổng hợp (Chat nằm bên ngoài project):** Hỏi 1 câu, AI search toàn bộ docs của user đã login, nếu chưa login thì chat với tài liệu public của thư viện hệ thống.
- Chat streams SSE: Stream sẽ nhanh hơn khi, không cần phải đợi hoàn thành mới trả về toàn bộ.
- **Mỗi lần chat thì sẽ được Citation tương ứng với tài liệu:** Câu trả lời của AI phải highlight được nguồn (Số trang, tên file) để user kiểm chứng.
- Chat (**Semantic Search**) thì dùng distance algorithms để đo khoảng cách giữa các vector. Gọi là tìm kiếm **ngữ nghĩa (Semantic)** chứ không phải **“Key word”**

#### **1.5. Khai thác**

- **Lưu yêu thích (Bookmark):** Đánh dấu tài liệu hay để truy cập nhanh.
- **Tải tài liệu:** Chỉ cho phép tải các tài liệu có cờ allow_download \= true.
- **Lịch sử:** Xem lại các file đã mở gần đây.

### ---

**📚 ACTOR 2: QUẢN LÝ THƯ VIỆN (LIBRARIAN)**

_Người đảm bảo chất lượng nội dung (Content Quality Assurance)._

#### **2.1. Quản lý Danh mục & Metadata (Chuẩn bị cho ElasticSearch hay search chuyên sâu)**

- **Chuẩn hóa Metadata:** Khi upload hoặc duyệt tài liệu, Librarian điền các trường: Tiêu đề, Tác giả, Năm xuất bản, Ngôn ngữ, Lĩnh vực (Category), Tags.
- **Auto-fill Metadata:** AI gợi ý điền tự động các thông tin trên dựa vào trang đầu của tài liệu.

#### **2.2. Quản lý Bộ sưu tập (Collections)**

- **Curated Lists:** Tạo các danh sách tài liệu theo chủ đề (VD: "Giáo trình nhập môn lập trình", "Tài liệu ôn thi cuối kỳ").
- **Thiết lập quyền truy cập:** Bộ sưu tập này dành cho ai? (Public cho Guest / Chỉ Member / Chỉ Giảng viên).

### ---

**🛠️ ACTOR 3: QUẢN TRỊ HỆ THỐNG (SYSTEM ADMIN)**

_Người vận hành kỹ thuật và giám sát hạ tầng._

#### **3.1. Quản trị Người dùng & Policy**

- **User Management:** Danh sách user, tìm kiếm user, Ban/Unban tài khoản, Đổi Role (User \-\> Librarian).
- **Quota Management:** Thiết lập giới hạn cho từng gói (VD: Sinh viên thường upload tối đa 100MB, Giảng viên 1GB).

#### **3.2. Giám sát & Logs**

- **Activity Logs:** Xem ai đã làm gì (User A xóa file B lúc mấy giờ).
- **System Health (PM2 Integration):** Xem trạng thái các service (API, Worker AI) thông qua giao diện Admin (CPU usage, RAM usage, Error logs).
- **Statistics Dashboard:**
  - Số lượng user mới.
  - Tổng số file, tổng dung lượng lưu trữ.
  - Số lượng câu hỏi AI đã trả lời (Token usage) để ước tính chi phí.

#### **3.3. Quản lý Cấu hình AI & Storage**

- **AI Configuration:**
  - _Model Selection:_ Chọn model LLM (GPT-3.5, GPT-4, hay Local Llama).
  - _Chunking Strategy:_ Cấu hình độ dài đoạn cắt (Chunk size: 1000 hay 2000 tokens), độ chồng lặp (Overlap).
- **Storage Logging:** Tracking log AWS S3.
- **Phục hồi dữ liệu:** "Thùng rác" hệ thống \- khôi phục các tài liệu mà User/Librarian đã lỡ tay xóa vĩnh viễn (Soft delete).

### ---

**🌍 ACTOR 4: KHÁCH (GUEST) \- (Đơn giản, muốn nhiều hơn thì loggin)**

- **Tra cứu Public:** Tìm kiếm và xem thông tin (metadata \+ tóm tắt) các tài liệu được set là PUBLIC.
- **Preview:** Xem trước 1 vài trang đầu (Watermarked \- đóng dấu bản quyền nếu cần).
- **Kiosk Mode:** Chế độ dành cho máy tra cứu tại thư viện (chỉ search, không login).

### ---

**TÓM TẮT LUỒNG DỮ LIỆU CHÍNH (KEY FLOWS)**

1. Luồng Upload & Xử lý:  
   User Upload \-\> Server lưu File \-\> Queue Worker \-\> OCR (Tách chữ) \-\> Chunking (Cắt đoạn) \-\> Embedding (Vector hóa) \-\> Lưu vào Vector DB (PgVector).
2. Luồng Chat RAG:  
   User hỏi \-\> Tạo vector câu hỏi \-\> Tìm kiếm vector tương đồng trong DB \-\> Lấy các đoạn text liên quan \-\> Gửi Prompt \+ Context cho LLM \-\> Trả về câu trả lời \-\> Lưu lịch sử Chat.
3. Luồng Cộng tác (Collaboration):  
   User A tạo Project \-\> Add User B \-\> A upload file vào Project \-\> B thấy file \-\> B chat với file đó \-\> Hệ thống dùng chung Index Vector của file cho cả A và B (Tiết kiệm tài nguyên).

### **Tính năng "WOW": THE AI EXAM SIMULATOR (GIẢ LẬP PHÒNG THI)**

Thay vì chỉ để User hỏi AI, hãy để **AI hỏi ngược lại User**.

**Mô tả tính năng:** Biến bất kỳ tài liệu (PDF/DOCX) hoặc Project nào thành một **Bài kiểm tra trắc nghiệm (Quiz) hoặc Flashcard ngay lập tức.**

**Luồng trải nghiệm (User Journey):**

1. User vào Project "Ôn thi Triết học".
2. Bấm nút **"Luyện thi ngay"**.
3. Hệ thống hiển thị popup: "Bạn muốn kiểm tra mức độ nào? (Dễ / Trung bình / Khó) \- Số lượng câu? (10/20)".
4. **WOW Moment:** Trong 5 giây, AI quét toàn bộ tài liệu trong Project, sinh ra bộ đề trắc nghiệm có đáp án ABCD.
5. User làm bài. Nộp bài.
6. **Super WOW Moment:** AI chấm điểm và **giải thích tại sao sai**, trích dẫn cụ thể: _"Bạn chọn A là sai. Đáp án đúng là C, vì theo trang 45 tài liệu 'Giáo trình A', khái niệm này được định nghĩa là..."_

Để hiện thực hóa tính năng **"AI Exam Simulator" (Tạo Quiz)** với stack hiện tại (NestJS \+ LangChain), bạn làm như sau:

1. **Backend (NestJS):**
   - Tạo thêm endpoint: `POST /project/:id/generate-quiz`.
   - Body nhận: `{ level: 'hard', numQuestions: 10, type: 'multiple-choice' }`.
2. **AI Service (LangChain):**
   - Bước 1: Retrieve (Lấy) các chunk ngẫu nhiên hoặc quan trọng từ Vector DB của Project đó.
   - Bước 2: Dùng Prompt Engineering (System Prompt):  
     _"Bạn là một giảng viên đại học khó tính. Dựa vào nội dung văn bản sau đây: \[CONTEXT\], hãy tạo ra 10 câu hỏi trắc nghiệm có 4 đáp án, chỉ rõ đáp án đúng và giải thích chi tiết tại sao. Trả về định dạng JSON."_
3. **Frontend:**
   - Render JSON đó thành giao diện làm bài thi.
   - Hiệu ứng pháo hoa khi User đạt điểm cao.
