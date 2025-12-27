// 图书管理系统 - 本地存储版 (无需JSON Server)
class BookManager {
    constructor() {
        // 检查登录状态
        this.checkLoginStatus();
        
        this.initDatabase(); // 初始化本地数据库
        this.init();
    }

    // 检查登录状态
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn !== 'true') {
            // 如果未登录，跳转到登录页面
            window.location.href = 'login.html';
        }
    }

    // 登出功能
    logout() {
        // 清除登录状态
        localStorage.removeItem('isLoggedIn');
        
        // 跳转到登录页面
        window.location.href = 'login.html';
    }

    // 初始化本地数据库
    initDatabase() {
        // 检查localStorage中是否已有数据
        if (!localStorage.getItem('books')) {
            // 如果没有，添加初始数据
            const initialBooks = [
                { id: 1, title: "JavaScript高级程序设计", author: "Nicholas C. Zakas", publisher: "人民邮电出版社" },
                { id: 2, title: "深入理解ES6", author: "Nicholas C. Zakas", publisher: "电子工业出版社" },
                { id: 3, title: "CSS揭秘", author: "Lea Verou", publisher: "人民邮电出版社" },
                { id: 4, title: "HTTP权威指南", author: "David Gourley", publisher: "人民邮电出版社" },
                { id: 5, title: "算法导论", author: "Thomas H. Cormen", publisher: "机械工业出版社" }
            ];
            localStorage.setItem('books', JSON.stringify(initialBooks));
        }
    }

    // 获取数据库中的所有图书
    getBooks() {
        return JSON.parse(localStorage.getItem('books') || '[]');
    }

    // 保存图书到数据库
    saveBooks(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    // 初始化事件监听
    init() {
        this.loadBooks();
        
        // 添加图书表单提交
        document.getElementById('addForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook();
        });

        // 搜索功能
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchBooks();
        });

        // 重置搜索
        document.getElementById('resetBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.loadBooks();
        });

        // 回车搜索
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });

        // 登出功能
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    // 显示状态信息
    showStatus(message, type = 'success') {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'status';
        }, 3000);
    }

    // 显示加载状态
    showLoading(show) {
        const loadingEl = document.getElementById('loading');
        loadingEl.style.display = show ? 'block' : 'none';
    }

    // 获取所有图书 (模拟GET请求)
    async loadBooks() {
        try {
            this.showLoading(true);
            
            // 模拟异步请求延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const books = this.getBooks();
            this.renderBooks(books);
            
        } catch (error) {
            console.error('获取图书失败:', error);
            this.showStatus('获取图书失败', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 搜索图书
    async searchBooks() {
        const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
        
        if (!keyword) {
            this.loadBooks();
            return;
        }

        try {
            this.showLoading(true);
            
            // 模拟异步请求延迟
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const books = this.getBooks();
            
            // 前端过滤搜索
            const filteredBooks = books.filter(book => 
                book.title.toLowerCase().includes(keyword) || 
                book.author.toLowerCase().includes(keyword)
            );
            
            this.renderBooks(filteredBooks);
            
        } catch (error) {
            console.error('搜索失败:', error);
            this.showStatus('搜索失败', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // 添加图书 (模拟POST请求)
    async addBook() {
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const publisher = document.getElementById('publisher').value.trim();

        // 基本验证
        if (!title || !author || !publisher) {
            this.showStatus('请填写所有字段', 'error');
            return;
        }

        try {
            // 模拟异步请求延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const books = this.getBooks();
            
            // 生成新ID
            const newId = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
            
            // 添加新图书
            const newBook = { id: newId, title, author, publisher };
            books.push(newBook);
            
            // 保存到数据库
            this.saveBooks(books);
            
            // 清空表单
            document.getElementById('addForm').reset();
            
            // 重新加载图书列表
            this.loadBooks();
            this.showStatus('图书添加成功！');
            
        } catch (error) {
            console.error('添加图书失败:', error);
            this.showStatus('添加图书失败', 'error');
        }
    }

    // 删除图书 (模拟DELETE请求)
    async deleteBook(id) {
        if (!confirm('确定要删除这本图书吗？')) {
            return;
        }

        try {
            // 模拟异步请求延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let books = this.getBooks();
            
            // 过滤掉要删除的图书
            books = books.filter(book => book.id !== id);
            
            // 保存到数据库
            this.saveBooks(books);
            
            this.loadBooks();
            this.showStatus('图书删除成功！');
            
        } catch (error) {
            console.error('删除图书失败:', error);
            this.showStatus('删除图书失败', 'error');
        }
    }

    // 更新图书 (模拟PUT请求)
    async updateBook(id, title, author, publisher) {
        try {
            // 模拟异步请求延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const books = this.getBooks();
            
            // 找到要更新的图书
            const bookIndex = books.findIndex(book => book.id === id);
            
            if (bookIndex === -1) {
                throw new Error('图书不存在');
            }
            
            // 更新图书信息
            books[bookIndex] = { id, title, author, publisher };
            
            // 保存到数据库
            this.saveBooks(books);
            
            this.loadBooks();
            this.showStatus('图书更新成功！');
            
        } catch (error) {
            console.error('更新图书失败:', error);
            this.showStatus('更新图书失败', 'error');
        }
    }

    // 渲染图书列表
    renderBooks(books) {
        const tbody = document.getElementById('booksBody');
        
        if (books.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">暂无图书数据</td></tr>';
            return;
        }

        tbody.innerHTML = books.map(book => `
            <tr data-id="${book.id}">
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>
                    <button class="btn edit-btn" onclick="bookManager.startEdit(${book.id})">编辑</button>
                    <button class="btn delete-btn" onclick="bookManager.deleteBook(${book.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 开始编辑
    startEdit(id) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const cells = row.querySelectorAll('td');
        
        // 保存原始值
        const originalData = {
            title: cells[1].textContent,
            author: cells[2].textContent,
            publisher: cells[3].textContent
        };

        // 转换为输入框
        cells[1].innerHTML = `<input type="text" class="edit-input" value="${originalData.title}" id="edit-title-${id}">`;
        cells[2].innerHTML = `<input type="text" class="edit-input" value="${originalData.author}" id="edit-author-${id}">`;
        cells[3].innerHTML = `<input type="text" class="edit-input" value="${originalData.publisher}" id="edit-publisher-${id}">`;
        
        // 更新操作按钮
        cells[4].innerHTML = `
            <button class="btn save-btn" onclick="bookManager.saveEdit(${id})">保存</button>
            <button class="btn cancel-btn" onclick="bookManager.cancelEdit(${id}, '${originalData.title}', '${originalData.author}', '${originalData.publisher}')">取消</button>
        `;
    }

    // 保存编辑
    saveEdit(id) {
        const title = document.getElementById(`edit-title-${id}`).value.trim();
        const author = document.getElementById(`edit-author-${id}`).value.trim();
        const publisher = document.getElementById(`edit-publisher-${id}`).value.trim();

        if (!title || !author || !publisher) {
            this.showStatus('所有字段都不能为空', 'error');
            return;
        }

        this.updateBook(id, title, author, publisher);
    }

    // 取消编辑
    cancelEdit(id, originalTitle, originalAuthor, originalPublisher) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const cells = row.querySelectorAll('td');
        
        // 恢复原始值
        cells[1].textContent = originalTitle;
        cells[2].textContent = originalAuthor;
        cells[3].textContent = originalPublisher;
        
        // 恢复操作按钮
        cells[4].innerHTML = `
            <button class="btn edit-btn" onclick="bookManager.startEdit(${id})">编辑</button>
            <button class="btn delete-btn" onclick="bookManager.deleteBook(${id})">删除</button>
        `;
    }
}

// 初始化图书管理系统
const bookManager = new BookManager();