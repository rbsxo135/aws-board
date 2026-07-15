const list = document.querySelector('#list');
const form = document.querySelector('#writeForm');
const titleInput = document.querySelector('#title');
const writerInput = document.querySelector('#writer');

// 💡 API 서버(ALB) 주소 정의
const API_URL = 'https://api.gitlab-ktg.kro.kr';

// 1. 게시글 목록을 서버에서 불러와 화면에 그리기 (GET /posts)
async function loadPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error('불러오기 실패');
    
    const posts = await res.json();
    renderList(posts); // 💡 서버에서 받은 실제 데이터를 전달
  } catch (err) {
    console.error(err);
    list.textContent = '데이터를 불러오는 중 오류가 발생했습니다.';
  }
}

// 2. 전달받은 게시글 데이터를 바탕으로 DOM 렌더링
function renderList(posts) {
  list.innerHTML = ''; // 먼저 비우기

  posts.forEach(post => {
    const li = document.createElement('li');
    li.textContent = `${post.title} - ${post.writer || '익명'}`;

    // 💡 li 클릭 이벤트: 상세 페이지 이동
    li.addEventListener('click', () => {
      location.href = `detail.html?id=${post.id}`;
    });

    // 삭제 버튼 요소 생성
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'btn delete-btn'; // CSS 스타일링용 클래스

    // 💡 삭제 버튼 클릭 이벤트: 서버에 삭제 요청 (DELETE /posts/:id)
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); // li의 클릭 이벤트(상세 이동) 방지
      
      if (!confirm('정말 삭제하시겠습니까?')) return;

      try {
        const res = await fetch(`${API_URL}/posts/${post.id}`, {
          method: 'DELETE'
        });

        if (res.status === 204) {
          // 삭제 성공 시 서버에서 최신 목록을 다시 가져와 갱신
          loadPosts();
        } else {
          alert('삭제에 실패했습니다.');
        }
      } catch (err) {
        console.error('삭제 오류:', err);
        alert('삭제 중 통신 에러가 발생했습니다.');
      }
    });

    // li 안에 삭제 버튼 추가
    li.appendChild(deleteBtn);
    
    // 전체 목록에 li 추가
    list.appendChild(li);
  });
}

// 3. 게시글 등록 이벤트 (POST /posts)
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // 새로고침 방지!

  const title = titleInput.value.trim();
  const writer = writerInput.value.trim();

  if (!title || !writer) return; // 빈 값 방지

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        writer,
        content: '' // posts.js 쿼리 구조에 맞춰 빈 값 전달
      })
    });

    if (res.ok) {
      form.reset(); // 폼 비우기
      loadPosts();  // 등록 성공 후 데이터 목록 새로고침
    } else {
      const errData = await res.json();
      alert(`등록 실패: ${errData.error || '알 수 없는 오류'}`);
    }
  } catch (err) {
    console.error('등록 오류:', err);
    alert('등록 중 통신 에러가 발생했습니다.');
  }
});

// 4. 페이지 진입 시 최초 실행
loadPosts();