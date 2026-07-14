const list = document.querySelector('#list');
const form = document.querySelector('#writeForm');
const titleInput = document.querySelector('#title');
const writerInput = document.querySelector('#writer');

function renderList() {
  list.innerHTML = '';           // 먼저 비우기
  posts.forEach(post => {
    const li = document.createElement('li');
    // renderList 안, li 만든 뒤
    li.addEventListener('click', () => {
        location.href = `detail.html?id=${post.id}`;   // (선택) 상세 이동
    });
    li.textContent = `${post.title} - ${post.writer}`;

    // 1. 삭제 버튼 요소 생성
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'btn'; // CSS 스타일링용 클래스 (선택)

    // 2. 삭제 버튼 클릭 이벤트 추가
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // ⭐ 중요: li의 클릭 이벤트가 실행되지 않도록 방지
      
      // 여기에 삭제 로직 구현 (예: 배열에서 제거 후 재렌더링)
      posts = posts.filter(p => p.title !== post.title);
      renderList();
    });

    // 3. li 항목 클릭 이벤트 (상세 페이지 이동)
    li.addEventListener('click', () => {
        location.href = `detail.html?id=${post.id}`;   
    });

    // 4. li 안에 삭제 버튼을 자식 요소로 추가
    li.appendChild(deleteBtn);
    
    // 5. 전체 목록에 li 추가
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();            // 새로고침 방지!
  const title = titleInput.value.trim();
  const writer = writerInput.value.trim();

  if (!title || !writer) return;            // 빈 값 방지

  posts.push({ id: Date.now(), title, writer });
  renderList();                  // 다시 그리기
  form.reset();                  // 폼 비우기
});

async function loadPosts() {
  try {
    const res = await fetch('posts.json');
    if (!res.ok) throw new Error('불러오기 실패');
    posts = await res.json();
    renderList();
  } catch (err) {
    list.textContent = '불러오기 실패';
  }
}

loadPosts();