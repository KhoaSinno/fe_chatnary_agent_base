// Mock Data for Chatnary E-Library System

import {
    User,
    Project,
    Document,
    ChatSession,
    Quiz,
    Collection,
    ActivityLog,
    SystemStats,
} from './types';

// ============ USERS ============
export const mockUsers: User[] = [
    {
        id: 'user-001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@university.edu.vn',
        role: 'user',
        avatar: undefined,
        quota: {
            used: 52428800, // 50MB
            limit: 104857600, // 100MB
        },
        createdAt: '2024-09-15T08:30:00Z',
    },
    {
        id: 'user-002',
        name: 'Trần Thị Bình',
        email: 'binh.tran@university.edu.vn',
        role: 'librarian',
        avatar: undefined,
        quota: {
            used: 524288000, // 500MB
            limit: 1073741824, // 1GB
        },
        createdAt: '2024-06-10T10:00:00Z',
    },
    {
        id: 'user-003',
        name: 'Lê Minh Cường',
        email: 'cuong.le@university.edu.vn',
        role: 'admin',
        avatar: undefined,
        quota: {
            used: 1073741824, // 1GB
            limit: 10737418240, // 10GB
        },
        createdAt: '2024-01-05T09:00:00Z',
    },
    {
        id: 'user-004',
        name: 'Phạm Hoàng Dung',
        email: 'dung.pham@university.edu.vn',
        role: 'user',
        avatar: undefined,
        quota: {
            used: 20971520, // 20MB
            limit: 104857600, // 100MB
        },
        createdAt: '2024-11-20T14:30:00Z',
    },
];

// ============ DOCUMENTS ============
export const mockDocuments: Document[] = [
    {
        id: 'doc-001',
        name: 'Giáo trình Triết học Mác-Lênin.pdf',
        type: 'pdf',
        status: 'done',
        size: 15728640, // 15MB
        pageCount: 320,
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-01T10:30:00Z',
        allowDownload: true,
        projectId: 'proj-001',
        url: '/LV_CTUET_ThinhNhat.pdf', // Real PDF file
        metadata: {
            title: 'Giáo trình Triết học Mác-Lênin',
            author: 'Bộ Giáo dục và Đào tạo',
            year: 2023,
            language: 'Vietnamese',
            category: 'Philosophy',
            tags: ['triết học', 'mác-lênin', 'giáo trình'],
        },
    },
    {
        id: 'doc-002',
        name: 'Tài liệu ôn tập Kinh tế chính trị.docx',
        type: 'docx',
        status: 'done',
        size: 5242880, // 5MB
        pageCount: 85,
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-05T14:20:00Z',
        allowDownload: true,
        projectId: 'proj-001',
        metadata: {
            title: 'Tài liệu ôn tập Kinh tế chính trị',
            author: 'Khoa Kinh tế',
            year: 2024,
            language: 'Vietnamese',
            category: 'Economics',
            tags: ['kinh tế', 'ôn tập', 'chính trị'],
        },
    },
    {
        id: 'doc-003',
        name: 'Machine Learning Fundamentals.pdf',
        type: 'pdf',
        status: 'processing',
        size: 25165824, // 24MB
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-10T09:15:00Z',
        allowDownload: false,
        projectId: 'proj-002',
    },
    {
        id: 'doc-004',
        name: 'Deep Learning with Python.pdf',
        type: 'pdf',
        status: 'done',
        size: 31457280, // 30MB
        pageCount: 450,
        uploadedBy: 'user-004',
        uploadedAt: '2024-11-28T16:45:00Z',
        allowDownload: true,
        projectId: 'proj-002',
        metadata: {
            title: 'Deep Learning with Python',
            author: 'François Chollet',
            year: 2021,
            language: 'English',
            category: 'Computer Science',
            tags: ['deep learning', 'python', 'AI', 'machine learning'],
        },
    },
    {
        id: 'doc-005',
        name: 'Nghiên cứu khoa học - Phương pháp luận.pdf',
        type: 'pdf',
        status: 'error',
        size: 8388608, // 8MB
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-08T11:00:00Z',
        allowDownload: false,
        projectId: 'proj-003',
    },
    {
        id: 'doc-006',
        name: 'Báo cáo nghiên cứu Q4-2024.docx',
        type: 'docx',
        status: 'done',
        size: 3145728, // 3MB
        pageCount: 42,
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-09T08:30:00Z',
        allowDownload: true,
        projectId: 'proj-003',
        metadata: {
            title: 'Báo cáo nghiên cứu Q4-2024',
            author: 'Nhóm NCKH',
            year: 2024,
            language: 'Vietnamese',
            category: 'Research',
            tags: ['báo cáo', 'nghiên cứu', '2024'],
        },
    },
    {
        id: 'doc-007',
        name: 'Introduction to Algorithms.pdf',
        type: 'pdf',
        status: 'done',
        size: 41943040, // 40MB
        pageCount: 1292,
        uploadedBy: 'user-002',
        uploadedAt: '2024-10-15T10:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen et al.',
            year: 2022,
            language: 'English',
            category: 'Computer Science',
            tags: ['algorithms', 'data structures', 'computer science'],
        },
    },
    // Additional mock documents for pagination testing
    {
        id: 'doc-008',
        name: 'Lập trình Python cơ bản.pdf',
        type: 'pdf',
        status: 'done',
        size: 12582912, // 12MB
        pageCount: 280,
        uploadedBy: 'user-001',
        uploadedAt: '2024-11-15T08:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'Lập trình Python cơ bản',
            author: 'Nguyễn Văn A',
            year: 2024,
            language: 'Vietnamese',
            category: 'Programming',
            tags: ['python', 'lập trình', 'cơ bản'],
        },
    },
    {
        id: 'doc-009',
        name: 'Cơ sở dữ liệu nâng cao.docx',
        type: 'docx',
        status: 'done',
        size: 4194304, // 4MB
        pageCount: 156,
        uploadedBy: 'user-001',
        uploadedAt: '2024-11-20T14:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Cơ sở dữ liệu nâng cao',
            author: 'Trần Thị B',
            year: 2024,
            language: 'Vietnamese',
            category: 'Database',
            tags: ['database', 'sql', 'nâng cao'],
        },
    },
    {
        id: 'doc-010',
        name: 'React JS Complete Guide.pdf',
        type: 'pdf',
        status: 'done',
        size: 18874368, // 18MB
        pageCount: 520,
        uploadedBy: 'user-001',
        uploadedAt: '2024-11-01T09:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'React JS Complete Guide',
            author: 'Maximilian Schwarzmüller',
            year: 2024,
            language: 'English',
            category: 'Web Development',
            tags: ['react', 'javascript', 'frontend'],
        },
    },
    {
        id: 'doc-011',
        name: 'Tài liệu Toán cao cấp A1.pdf',
        type: 'pdf',
        status: 'done',
        size: 9437184, // 9MB
        pageCount: 245,
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-28T11:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'Toán cao cấp A1',
            author: 'Khoa Toán - Tin',
            year: 2023,
            language: 'Vietnamese',
            category: 'Mathematics',
            tags: ['toán', 'đại số', 'giải tích'],
        },
    },
    {
        id: 'doc-012',
        name: 'Node.js Backend Development.pdf',
        type: 'pdf',
        status: 'processing',
        size: 15728640, // 15MB
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-11T10:00:00Z',
        allowDownload: false,
    },
    {
        id: 'doc-013',
        name: 'Thiết kế UI UX cơ bản.docx',
        type: 'docx',
        status: 'done',
        size: 6291456, // 6MB
        pageCount: 178,
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-20T15:45:00Z',
        allowDownload: true,
        metadata: {
            title: 'Thiết kế UI/UX cơ bản',
            author: 'Lê Văn C',
            year: 2024,
            language: 'Vietnamese',
            category: 'Design',
            tags: ['ui', 'ux', 'design', 'figma'],
        },
    },
    {
        id: 'doc-014',
        name: 'Lý thuyết đồ thị và ứng dụng.pdf',
        type: 'pdf',
        status: 'done',
        size: 7340032, // 7MB
        pageCount: 198,
        uploadedBy: 'user-001',
        uploadedAt: '2024-10-05T08:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Lý thuyết đồ thị và ứng dụng',
            author: 'Khoa CNTT',
            year: 2023,
            language: 'Vietnamese',
            category: 'Computer Science',
            tags: ['đồ thị', 'thuật toán', 'ứng dụng'],
        },
    },
    {
        id: 'doc-015',
        name: 'Docker and Kubernetes Guide.pdf',
        type: 'pdf',
        status: 'done',
        size: 22020096, // 21MB
        pageCount: 380,
        uploadedBy: 'user-001',
        uploadedAt: '2024-09-25T13:20:00Z',
        allowDownload: true,
        metadata: {
            title: 'Docker and Kubernetes Guide',
            author: 'DevOps Team',
            year: 2024,
            language: 'English',
            category: 'DevOps',
            tags: ['docker', 'kubernetes', 'devops', 'container'],
        },
    },
    {
        id: 'doc-016',
        name: 'Bài giảng Vật lý đại cương.docx',
        type: 'docx',
        status: 'error',
        size: 5242880, // 5MB
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-05T16:30:00Z',
        allowDownload: false,
    },
    {
        id: 'doc-017',
        name: 'TypeScript Handbook.pdf',
        type: 'pdf',
        status: 'done',
        size: 10485760, // 10MB
        pageCount: 312,
        uploadedBy: 'user-001',
        uploadedAt: '2024-09-18T09:45:00Z',
        allowDownload: true,
        metadata: {
            title: 'TypeScript Handbook',
            author: 'Microsoft',
            year: 2024,
            language: 'English',
            category: 'Programming',
            tags: ['typescript', 'javascript', 'typing'],
        },
    },
    {
        id: 'doc-018',
        name: 'Kỹ thuật lập trình hướng đối tượng.pdf',
        type: 'pdf',
        status: 'done',
        size: 8388608, // 8MB
        pageCount: 220,
        uploadedBy: 'user-001',
        uploadedAt: '2024-09-10T14:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Kỹ thuật lập trình hướng đối tượng',
            author: 'Khoa CNTT',
            year: 2023,
            language: 'Vietnamese',
            category: 'Programming',
            tags: ['oop', 'java', 'lập trình'],
        },
    },
    {
        id: 'doc-019',
        name: 'AWS Cloud Practitioner.pdf',
        type: 'pdf',
        status: 'done',
        size: 14680064, // 14MB
        pageCount: 425,
        uploadedBy: 'user-001',
        uploadedAt: '2024-08-28T11:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'AWS Cloud Practitioner',
            author: 'Amazon Web Services',
            year: 2024,
            language: 'English',
            category: 'Cloud',
            tags: ['aws', 'cloud', 'certification'],
        },
    },
    {
        id: 'doc-020',
        name: 'Tài liệu Tiếng Anh chuyên ngành IT.docx',
        type: 'docx',
        status: 'done',
        size: 3670016, // 3.5MB
        pageCount: 95,
        uploadedBy: 'user-001',
        uploadedAt: '2024-08-15T08:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'Tiếng Anh chuyên ngành IT',
            author: 'Khoa Ngoại ngữ',
            year: 2024,
            language: 'Vietnamese',
            category: 'English',
            tags: ['english', 'it', 'vocabulary'],
        },
    },
    {
        id: 'doc-021',
        name: 'Git and GitHub Fundamentals.pdf',
        type: 'pdf',
        status: 'done',
        size: 6815744, // 6.5MB
        pageCount: 168,
        uploadedBy: 'user-001',
        uploadedAt: '2024-08-08T15:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Git and GitHub Fundamentals',
            author: 'GitHub Team',
            year: 2024,
            language: 'English',
            category: 'Version Control',
            tags: ['git', 'github', 'version control'],
        },
    },
    {
        id: 'doc-022',
        name: 'Phân tích thiết kế hệ thống.pdf',
        type: 'pdf',
        status: 'processing',
        size: 11534336, // 11MB
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-12T09:00:00Z',
        allowDownload: false,
    },
    {
        id: 'doc-023',
        name: 'Linux Administration.pdf',
        type: 'pdf',
        status: 'done',
        size: 19922944, // 19MB
        pageCount: 540,
        uploadedBy: 'user-001',
        uploadedAt: '2024-07-25T10:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'Linux Administration',
            author: 'Linux Foundation',
            year: 2023,
            language: 'English',
            category: 'System Admin',
            tags: ['linux', 'administration', 'system'],
        },
    },
    {
        id: 'doc-024',
        name: 'Nguyên lý hệ điều hành.docx',
        type: 'docx',
        status: 'done',
        size: 4718592, // 4.5MB
        pageCount: 135,
        uploadedBy: 'user-001',
        uploadedAt: '2024-07-18T14:15:00Z',
        allowDownload: true,
        metadata: {
            title: 'Nguyên lý hệ điều hành',
            author: 'Khoa CNTT',
            year: 2023,
            language: 'Vietnamese',
            category: 'Operating Systems',
            tags: ['hệ điều hành', 'os', 'nguyên lý'],
        },
    },
    {
        id: 'doc-025',
        name: 'MongoDB The Definitive Guide.pdf',
        type: 'pdf',
        status: 'done',
        size: 16777216, // 16MB
        pageCount: 468,
        uploadedBy: 'user-001',
        uploadedAt: '2024-07-10T08:45:00Z',
        allowDownload: true,
        metadata: {
            title: 'MongoDB: The Definitive Guide',
            author: "Shannon Bradshaw",
            year: 2023,
            language: 'English',
            category: 'Database',
            tags: ['mongodb', 'nosql', 'database'],
        },
    },
    {
        id: 'doc-026',
        name: 'Trí tuệ nhân tạo đại cương.pdf',
        type: 'pdf',
        status: 'done',
        size: 13631488, // 13MB
        pageCount: 356,
        uploadedBy: 'user-001',
        uploadedAt: '2024-06-28T11:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Trí tuệ nhân tạo đại cương',
            author: 'Khoa CNTT',
            year: 2024,
            language: 'Vietnamese',
            category: 'AI',
            tags: ['ai', 'trí tuệ nhân tạo', 'machine learning'],
        },
    },
    {
        id: 'doc-027',
        name: 'Next.js App Router Guide.pdf',
        type: 'pdf',
        status: 'done',
        size: 9961472, // 9.5MB
        pageCount: 285,
        uploadedBy: 'user-001',
        uploadedAt: '2024-06-20T16:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'Next.js App Router Guide',
            author: 'Vercel',
            year: 2024,
            language: 'English',
            category: 'Web Development',
            tags: ['nextjs', 'react', 'app router'],
        },
    },
    {
        id: 'doc-028',
        name: 'Mạng máy tính và internet.docx',
        type: 'docx',
        status: 'done',
        size: 5767168, // 5.5MB
        pageCount: 148,
        uploadedBy: 'user-001',
        uploadedAt: '2024-06-12T09:15:00Z',
        allowDownload: true,
        metadata: {
            title: 'Mạng máy tính và internet',
            author: 'Khoa CNTT',
            year: 2023,
            language: 'Vietnamese',
            category: 'Networking',
            tags: ['mạng', 'network', 'internet'],
        },
    },
    {
        id: 'doc-029',
        name: 'Clean Code Principles.pdf',
        type: 'pdf',
        status: 'done',
        size: 7864320, // 7.5MB
        pageCount: 235,
        uploadedBy: 'user-001',
        uploadedAt: '2024-06-05T13:45:00Z',
        allowDownload: true,
        metadata: {
            title: 'Clean Code Principles',
            author: 'Robert C. Martin',
            year: 2022,
            language: 'English',
            category: 'Software Engineering',
            tags: ['clean code', 'best practices', 'programming'],
        },
    },
    {
        id: 'doc-030',
        name: 'Bảo mật thông tin cơ bản.pdf',
        type: 'pdf',
        status: 'error',
        size: 8912896, // 8.5MB
        uploadedBy: 'user-001',
        uploadedAt: '2024-12-10T14:00:00Z',
        allowDownload: false,
    },
    {
        id: 'doc-031',
        name: 'PostgreSQL Administration.pdf',
        type: 'pdf',
        status: 'done',
        size: 12058624, // 11.5MB
        pageCount: 342,
        uploadedBy: 'user-001',
        uploadedAt: '2024-05-28T10:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'PostgreSQL Administration',
            author: 'PostgreSQL Team',
            year: 2024,
            language: 'English',
            category: 'Database',
            tags: ['postgresql', 'sql', 'database'],
        },
    },
    {
        id: 'doc-032',
        name: 'Xử lý ngôn ngữ tự nhiên.docx',
        type: 'docx',
        status: 'done',
        size: 6553600, // 6.25MB
        pageCount: 187,
        uploadedBy: 'user-001',
        uploadedAt: '2024-05-20T15:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'Xử lý ngôn ngữ tự nhiên',
            author: 'Khoa CNTT',
            year: 2024,
            language: 'Vietnamese',
            category: 'NLP',
            tags: ['nlp', 'ai', 'ngôn ngữ'],
        },
    },
    {
        id: 'doc-033',
        name: 'GraphQL API Design.pdf',
        type: 'pdf',
        status: 'done',
        size: 8126464, // 7.75MB
        pageCount: 215,
        uploadedBy: 'user-001',
        uploadedAt: '2024-05-12T08:30:00Z',
        allowDownload: true,
        metadata: {
            title: 'GraphQL API Design',
            author: 'Meta Engineering',
            year: 2024,
            language: 'English',
            category: 'API',
            tags: ['graphql', 'api', 'backend'],
        },
    },
    {
        id: 'doc-034',
        name: 'Kiến trúc phần mềm hiện đại.pdf',
        type: 'pdf',
        status: 'done',
        size: 14155776, // 13.5MB
        pageCount: 398,
        uploadedBy: 'user-001',
        uploadedAt: '2024-05-05T11:45:00Z',
        allowDownload: true,
        metadata: {
            title: 'Kiến trúc phần mềm hiện đại',
            author: 'Khoa CNTT',
            year: 2024,
            language: 'Vietnamese',
            category: 'Architecture',
            tags: ['microservices', 'architecture', 'design patterns'],
        },
    },
    {
        id: 'doc-035',
        name: 'Tailwind CSS Mastery.pdf',
        type: 'pdf',
        status: 'done',
        size: 5505024, // 5.25MB
        pageCount: 142,
        uploadedBy: 'user-001',
        uploadedAt: '2024-04-28T14:00:00Z',
        allowDownload: true,
        metadata: {
            title: 'Tailwind CSS Mastery',
            author: 'Adam Wathan',
            year: 2024,
            language: 'English',
            category: 'CSS',
            tags: ['tailwind', 'css', 'frontend'],
        },
    },
];

// ============ PROJECTS ============
export const mockProjects: Project[] = [
    {
        id: 'proj-001',
        name: 'Ôn thi Triết học',
        description: 'Tài liệu ôn thi cuối kỳ môn Triết học Mác-Lênin',
        color: '#3B82F6', // Blue
        ownerId: 'user-001',
        members: [
            { userId: 'user-001', role: 'owner', joinedAt: '2024-12-01T10:00:00Z' },
            { userId: 'user-004', role: 'editor', joinedAt: '2024-12-02T14:00:00Z' },
        ],
        documentIds: ['doc-001', 'doc-002'],
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-10T15:30:00Z',
    },
    {
        id: 'proj-002',
        name: 'AI & Machine Learning',
        description: 'Nghiên cứu về trí tuệ nhân tạo và học máy',
        color: '#10B981', // Green
        ownerId: 'user-001',
        members: [
            { userId: 'user-001', role: 'owner', joinedAt: '2024-11-20T09:00:00Z' },
            { userId: 'user-004', role: 'viewer', joinedAt: '2024-11-25T11:00:00Z' },
        ],
        documentIds: ['doc-003', 'doc-004'],
        createdAt: '2024-11-20T09:00:00Z',
        updatedAt: '2024-12-10T09:15:00Z',
    },
    {
        id: 'proj-003',
        name: 'Nhóm NCKH Mùa Thu',
        description: 'Dự án nghiên cứu khoa học sinh viên',
        color: '#F59E0B', // Amber
        ownerId: 'user-001',
        members: [
            { userId: 'user-001', role: 'owner', joinedAt: '2024-10-01T08:00:00Z' },
            { userId: 'user-004', role: 'editor', joinedAt: '2024-10-05T10:00:00Z' },
        ],
        documentIds: ['doc-005', 'doc-006'],
        createdAt: '2024-10-01T08:00:00Z',
        updatedAt: '2024-12-09T08:30:00Z',
    },
    {
        id: 'proj-004',
        name: 'Luận văn tốt nghiệp',
        description: 'Tài liệu tham khảo cho luận văn',
        color: '#8B5CF6', // Purple
        ownerId: 'user-001',
        members: [
            { userId: 'user-001', role: 'owner', joinedAt: '2024-09-01T08:00:00Z' },
        ],
        documentIds: [],
        createdAt: '2024-09-01T08:00:00Z',
        updatedAt: '2024-09-01T08:00:00Z',
    },
];

// ============ CHAT SESSIONS ============
export const mockChatSessions: ChatSession[] = [
    {
        id: 'chat-001',
        projectId: 'proj-001',
        userId: 'user-001',
        messages: [
            {
                id: 'msg-001',
                role: 'user',
                content: 'Triết học Mác-Lênin có những nguyên lý cơ bản nào?',
                timestamp: '2024-12-10T14:30:00Z',
            },
            {
                id: 'msg-002',
                role: 'assistant',
                content: `Triết học Mác-Lênin có hai nguyên lý cơ bản:

**1. Nguyên lý về mối liên hệ phổ biến:**
Mọi sự vật, hiện tượng trong thế giới đều tồn tại trong mối liên hệ, tác động qua lại lẫn nhau, không có sự vật nào tồn tại cô lập, tách rời.

**2. Nguyên lý về sự phát triển:**
Mọi sự vật, hiện tượng đều vận động và phát triển theo chiều hướng đi lên từ thấp đến cao, từ đơn giản đến phức tạp.

Hai nguyên lý này là nền tảng cho toàn bộ hệ thống triết học Mác-Lênin và phương pháp biện chứng duy vật.`,
                citations: [
                    {
                        documentId: 'doc-001',
                        documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                        pageNumber: 45,
                        excerpt: 'Nguyên lý về mối liên hệ phổ biến là một trong những nguyên lý cơ bản...',
                    },
                    {
                        documentId: 'doc-001',
                        documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                        pageNumber: 52,
                        excerpt: 'Nguyên lý về sự phát triển phản ánh xu hướng vận động đi lên...',
                    },
                ],
                timestamp: '2024-12-10T14:30:05Z',
            },
            {
                id: 'msg-003',
                role: 'user',
                content: 'Giải thích thêm về phương pháp biện chứng duy vật?',
                timestamp: '2024-12-10T14:32:00Z',
            },
            {
                id: 'msg-004',
                role: 'assistant',
                content: `**Phương pháp biện chứng duy vật** là phương pháp nhận thức thế giới dựa trên các nguyên tắc:

1. **Xem xét sự vật trong mối liên hệ:** Không xem xét cô lập mà đặt trong tổng thể các mối quan hệ.

2. **Xem xét sự vật trong sự vận động, phát triển:** Không chỉ nhìn trạng thái hiện tại mà còn xem xét quá khứ và xu hướng tương lai.

3. **Phân tích mâu thuẫn:** Tìm ra mâu thuẫn bên trong sự vật - động lực của sự phát triển.

4. **Thống nhất lý luận với thực tiễn:** Kiểm nghiệm nhận thức thông qua hoạt động thực tiễn.

Phương pháp này đối lập với phương pháp siêu hình - xem xét sự vật một cách cô lập, bất biến.`,
                citations: [
                    {
                        documentId: 'doc-001',
                        documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                        pageNumber: 28,
                        excerpt: 'Phương pháp biện chứng duy vật yêu cầu xem xét sự vật trong mối liên hệ...',
                    },
                    {
                        documentId: 'doc-002',
                        documentName: 'Tài liệu ôn tập Kinh tế chính trị.docx',
                        pageNumber: 12,
                        excerpt: 'Vận dụng phương pháp biện chứng duy vật trong phân tích kinh tế...',
                    },
                ],
                timestamp: '2024-12-10T14:32:08Z',
            },
        ],
        createdAt: '2024-12-10T14:30:00Z',
        updatedAt: '2024-12-10T14:32:08Z',
    },
    {
        id: 'chat-002',
        projectId: 'proj-002',
        userId: 'user-001',
        messages: [
            {
                id: 'msg-005',
                role: 'user',
                content: 'What is the difference between supervised and unsupervised learning?',
                timestamp: '2024-12-09T16:00:00Z',
            },
            {
                id: 'msg-006',
                role: 'assistant',
                content: `**Supervised Learning** và **Unsupervised Learning** là hai paradigm chính trong Machine Learning:

## Supervised Learning (Học có giám sát)
- **Input:** Dữ liệu đã được gán nhãn (labeled data)
- **Mục tiêu:** Học ánh xạ từ input → output
- **Ví dụ:** Classification, Regression
- **Use cases:** Spam detection, Image classification, Price prediction

## Unsupervised Learning (Học không giám sát)
- **Input:** Dữ liệu chưa được gán nhãn
- **Mục tiêu:** Tìm cấu trúc ẩn trong dữ liệu
- **Ví dụ:** Clustering, Dimensionality Reduction
- **Use cases:** Customer segmentation, Anomaly detection

Ngoài ra còn có **Semi-supervised Learning** (kết hợp cả hai) và **Reinforcement Learning** (học từ reward).`,
                citations: [
                    {
                        documentId: 'doc-004',
                        documentName: 'Deep Learning with Python.pdf',
                        pageNumber: 23,
                        excerpt: 'Supervised learning is the most common form of machine learning...',
                    },
                    {
                        documentId: 'doc-004',
                        documentName: 'Deep Learning with Python.pdf',
                        pageNumber: 31,
                        excerpt: 'Unsupervised learning aims to discover hidden patterns...',
                    },
                ],
                timestamp: '2024-12-09T16:00:12Z',
            },
        ],
        createdAt: '2024-12-09T16:00:00Z',
        updatedAt: '2024-12-09T16:00:12Z',
    },
];

// ============ QUIZ ============
export const mockQuiz: Quiz = {
    id: 'quiz-001',
    projectId: 'proj-001',
    difficulty: 'medium',
    questions: [
        {
            id: 'q-001',
            question: 'Triết học Mác-Lênin có bao nhiêu nguyên lý cơ bản?',
            options: [
                { label: 'A', text: '1 nguyên lý' },
                { label: 'B', text: '2 nguyên lý' },
                { label: 'C', text: '3 nguyên lý' },
                { label: 'D', text: '4 nguyên lý' },
            ],
            correctAnswer: 'B',
            explanation: 'Triết học Mác-Lênin có 2 nguyên lý cơ bản: Nguyên lý về mối liên hệ phổ biến và Nguyên lý về sự phát triển.',
            citation: {
                documentId: 'doc-001',
                documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                pageNumber: 42,
                excerpt: 'Hai nguyên lý cơ bản của phép biện chứng duy vật...',
            },
        },
        {
            id: 'q-002',
            question: 'Phương pháp nào đối lập với phương pháp biện chứng duy vật?',
            options: [
                { label: 'A', text: 'Phương pháp thực nghiệm' },
                { label: 'B', text: 'Phương pháp siêu hình' },
                { label: 'C', text: 'Phương pháp quy nạp' },
                { label: 'D', text: 'Phương pháp diễn dịch' },
            ],
            correctAnswer: 'B',
            explanation: 'Phương pháp siêu hình xem xét sự vật một cách cô lập, bất biến - đối lập với phương pháp biện chứng duy vật.',
            citation: {
                documentId: 'doc-001',
                documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                pageNumber: 35,
                excerpt: 'Phương pháp siêu hình là cách xem xét sự vật trong trạng thái cô lập...',
            },
        },
        {
            id: 'q-003',
            question: 'Theo triết học Mác-Lênin, động lực của sự phát triển là gì?',
            options: [
                { label: 'A', text: 'Sự tác động của ngoại cảnh' },
                { label: 'B', text: 'Mâu thuẫn bên trong sự vật' },
                { label: 'C', text: 'Ý chí của con người' },
                { label: 'D', text: 'Quy luật tự nhiên' },
            ],
            correctAnswer: 'B',
            explanation: 'Mâu thuẫn bên trong sự vật là nguồn gốc, động lực của sự vận động và phát triển.',
            citation: {
                documentId: 'doc-001',
                documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                pageNumber: 67,
                excerpt: 'Mâu thuẫn là nguồn gốc, động lực của mọi sự vận động và phát triển...',
            },
        },
        {
            id: 'q-004',
            question: 'Nguyên lý về mối liên hệ phổ biến khẳng định điều gì?',
            options: [
                { label: 'A', text: 'Mọi sự vật đều tồn tại độc lập' },
                { label: 'B', text: 'Chỉ một số sự vật có liên hệ với nhau' },
                { label: 'C', text: 'Mọi sự vật đều liên hệ, tác động qua lại lẫn nhau' },
                { label: 'D', text: 'Liên hệ chỉ tồn tại trong tư duy' },
            ],
            correctAnswer: 'C',
            explanation: 'Nguyên lý về mối liên hệ phổ biến khẳng định mọi sự vật, hiện tượng trong thế giới đều tồn tại trong mối liên hệ, tác động qua lại lẫn nhau.',
            citation: {
                documentId: 'doc-001',
                documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                pageNumber: 45,
                excerpt: 'Nguyên lý về mối liên hệ phổ biến là một trong những nguyên lý cơ bản...',
            },
        },
        {
            id: 'q-005',
            question: 'Yêu cầu nào sau đây KHÔNG thuộc phương pháp biện chứng duy vật?',
            options: [
                { label: 'A', text: 'Xem xét sự vật trong mối liên hệ' },
                { label: 'B', text: 'Xem xét sự vật trong trạng thái cô lập' },
                { label: 'C', text: 'Thống nhất lý luận với thực tiễn' },
                { label: 'D', text: 'Phân tích mâu thuẫn bên trong sự vật' },
            ],
            correctAnswer: 'B',
            explanation: '"Xem xét sự vật trong trạng thái cô lập" là đặc trưng của phương pháp siêu hình, không phải biện chứng duy vật.',
            citation: {
                documentId: 'doc-001',
                documentName: 'Giáo trình Triết học Mác-Lênin.pdf',
                pageNumber: 28,
                excerpt: 'Phương pháp biện chứng duy vật yêu cầu xem xét sự vật trong mối liên hệ...',
            },
        },
    ],
    createdAt: '2024-12-10T15:00:00Z',
};

// ============ COLLECTIONS (Librarian) ============
export const mockCollections: Collection[] = [
    {
        id: 'col-001',
        name: 'Giáo trình nhập môn lập trình',
        description: 'Bộ sưu tập các tài liệu cơ bản về lập trình cho sinh viên năm nhất',
        documentIds: ['doc-007'],
        access: 'public',
        createdBy: 'user-002',
        createdAt: '2024-10-01T08:00:00Z',
    },
    {
        id: 'col-002',
        name: 'Tài liệu ôn thi cuối kỳ',
        description: 'Tổng hợp tài liệu ôn tập cho kỳ thi cuối kỳ',
        documentIds: ['doc-001', 'doc-002'],
        access: 'members',
        createdBy: 'user-002',
        createdAt: '2024-11-15T10:00:00Z',
    },
    {
        id: 'col-003',
        name: 'Nghiên cứu AI/ML chuyên sâu',
        description: 'Tài liệu nâng cao về trí tuệ nhân tạo và học máy',
        documentIds: ['doc-004'],
        access: 'faculty',
        createdBy: 'user-002',
        createdAt: '2024-11-28T14:00:00Z',
    },
];

// ============ ACTIVITY LOGS (Admin) ============
export const mockActivityLogs: ActivityLog[] = [
    {
        id: 'log-001',
        userId: 'user-001',
        userName: 'Nguyễn Văn An',
        action: 'Uploaded document',
        target: 'Machine Learning Fundamentals.pdf',
        timestamp: '2024-12-10T09:15:00Z',
    },
    {
        id: 'log-002',
        userId: 'user-001',
        userName: 'Nguyễn Văn An',
        action: 'Started chat session',
        target: 'Project: Ôn thi Triết học',
        timestamp: '2024-12-10T14:30:00Z',
    },
    {
        id: 'log-003',
        userId: 'user-004',
        userName: 'Phạm Hoàng Dung',
        action: 'Joined project',
        target: 'Ôn thi Triết học',
        timestamp: '2024-12-02T14:00:00Z',
    },
    {
        id: 'log-004',
        userId: 'user-002',
        userName: 'Trần Thị Bình',
        action: 'Created collection',
        target: 'Tài liệu ôn thi cuối kỳ',
        timestamp: '2024-11-15T10:00:00Z',
    },
    {
        id: 'log-005',
        userId: 'user-001',
        userName: 'Nguyễn Văn An',
        action: 'Downloaded document',
        target: 'Deep Learning with Python.pdf',
        timestamp: '2024-12-09T17:30:00Z',
    },
    {
        id: 'log-006',
        userId: 'user-004',
        userName: 'Phạm Hoàng Dung',
        action: 'Completed quiz',
        target: 'Project: Ôn thi Triết học - Score: 80%',
        timestamp: '2024-12-10T16:45:00Z',
    },
];

// ============ SYSTEM STATS (Admin) ============
export const mockSystemStats: SystemStats = {
    totalUsers: 1247,
    newUsersThisMonth: 89,
    totalDocuments: 3842,
    totalStorage: 107374182400, // 100GB
    aiQueriesThisMonth: 15420,
    tokenUsage: 2450000,
};

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
    return mockUsers.find((u) => u.id === id);
}

// Helper function to get project by ID
export function getProjectById(id: string): Project | undefined {
    return mockProjects.find((p) => p.id === id);
}

// Helper function to get document by ID
export function getDocumentById(id: string): Document | undefined {
    return mockDocuments.find((d) => d.id === id);
}

// Helper function to get documents by project ID
export function getDocumentsByProjectId(projectId: string): Document[] {
    return mockDocuments.filter((d) => d.projectId === projectId);
}

// Helper function to get chat session by project ID
export function getChatSessionByProjectId(projectId: string): ChatSession | undefined {
    return mockChatSessions.find((c) => c.projectId === projectId);
}
