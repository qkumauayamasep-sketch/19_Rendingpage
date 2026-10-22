// SIIII.TR의 모든 화면 상호작용을 한곳에서 관리합니다.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const body = document.body;

// 외부 사진을 불러오지 못했을 때 레이아웃을 유지하는 대체 이미지입니다.
const fallbackSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#d9ddd4"/><path d="M0 580L260 340l150 145 220-260 330 355 240-210v430H0z" fill="#899486"/><circle cx="955" cy="175" r="64" fill="#f7f2e6"/><text x="70" y="735" font-family="Arial" font-size="30" fill="#344638" letter-spacing="7">SIIII.TR · IMAGE UNAVAILABLE</text></svg>`)}`;
$$('img.image-fallback').forEach(img => img.addEventListener('error', () => { img.src = fallbackSvg; img.alt = `${img.alt} (이미지를 불러오지 못했습니다)`; }, { once: true }));

// 고정 헤더와 맨 위로 버튼 상태를 스크롤 위치에 따라 바꿉니다.
const header = $('.site-header');
const topButton = $('.to-top');
const updateScrollUi = () => {
  header?.classList.toggle('scrolled', scrollY > 24);
  topButton?.classList.toggle('visible', scrollY > 650);
};
addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();
topButton?.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

// 모바일 메뉴를 열고 닫습니다. 메뉴 링크를 누르면 자동으로 닫힙니다.
const menuToggle = $('.menu-toggle');
const mobileMenu = $('#mobile-menu');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileMenu.hidden = !open;
  body.classList.toggle('menu-open', open);
}
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
if (mobileMenu) $$('a', mobileMenu).forEach(link => link.addEventListener('click', () => setMenu(false)));

// 여행지와 매거진 상세 내용은 하나의 접근 가능한 대화상자에서 보여줍니다.
const contentDialog = $('#content-dialog');
const placeData = {
  naejangsan: { kicker: '전북특별자치도 정읍시', title: '내장산', body: `<p>내장산은 산 능선과 계곡, 숲이 어우러진 국립공원입니다. 가을 단풍으로 널리 알려져 있으며, 자연을 천천히 바라보는 여행에 어울립니다.</p><dl><div><dt>추천 기분</dt><dd>자연 속 휴식</dd></div><div><dt>여행 방식</dt><dd>산책과 풍경 감상</dd></div><div><dt>확인 사항</dt><dd>방문 전 국립공원 공식 탐방 안내와 기상 정보 확인</dd></div></dl><a class="button" href="#course" data-close-dialog>당일 코스 보기</a>` },
  seoul: { kicker: '도시 산책 · 감각적인 공간', title: '서울', body: `<p>남산에서 도시의 윤곽을 바라본 뒤, 오래된 골목과 새로운 공간을 함께 걸어보세요. 하나의 동네를 정해 천천히 둘러보는 방식이 잘 어울립니다.</p><dl><div><dt>추천 기분</dt><dd>새로운 도시 발견</dd></div><div><dt>추천 방식</dt><dd>전망과 골목 산책</dd></div></dl>` },
  busan: { kicker: '바다 · 해안 풍경', title: '부산', body: `<p>광안리의 바다와 광안대교가 만드는 넓은 풍경은 걷는 시간에 따라 다른 표정을 보여줍니다. 이른 아침이나 해 질 무렵의 해안 산책을 추천합니다.</p><dl><div><dt>추천 기분</dt><dd>바다를 바라보는 휴식</dd></div><div><dt>추천 방식</dt><dd>해안 산책</dd></div></dl>` },
  daegu: { kicker: '골목 · 로컬 문화', title: '대구', body: `<p>앞산에서 도심을 바라보고, 오래된 골목과 지역의 생활 문화를 이어서 만나보세요. 유명 장소를 모으기보다 한 구역에 머무는 여행이 좋습니다.</p><dl><div><dt>추천 기분</dt><dd>로컬 문화 발견</dd></div><div><dt>추천 방식</dt><dd>도심 전망과 골목 산책</dd></div></dl>` },
  yeosu: { kicker: '섬 · 남해의 바다', title: '여수', body: `<p>오동도에서 바라보는 바다와 여수의 섬 풍경은 느린 여행에 잘 어울립니다. 바다 곁에서 머물며 빛과 바람이 바뀌는 시간을 지켜보세요.</p><dl><div><dt>추천 기분</dt><dd>여유로운 바다 여행</dd></div><div><dt>추천 방식</dt><dd>섬과 해안 풍경 감상</dd></div></dl>` }
};
const articleData = {
  autumn: { kicker: '계절 여행 · 5분', title: '단풍이 가장 아름다운 계절을 걷는 법', body: `<p><strong>이 글은 SIIII.TR의 샘플 매거진 콘텐츠입니다.</strong></p><p>단풍 여행은 많은 장소를 빠르게 통과하는 일정과 잘 맞지 않습니다. 첫째, 걷고 싶은 길 하나를 정합니다. 둘째, 방문 전 날씨와 탐방로 정보를 확인합니다. 셋째, 가장 좋은 장면 앞에서는 계획보다 오래 머뭅니다.</p><p>내장산처럼 계절 변화가 선명한 산에서는 빛의 방향과 숲의 밀도만으로도 시간마다 전혀 다른 장면을 만날 수 있습니다.</p>` },
  sea: { kicker: '도시 여행 · 4분', title: '바다가 보이는 도시에서 하루 보내기', body: `<p><strong>이 글은 SIIII.TR의 샘플 매거진 콘텐츠입니다.</strong></p><p>바다 도시의 하루는 이른 시간부터 시작해 보세요. 사람의 움직임이 적은 아침에는 파도와 바람의 소리가 더 가깝습니다. 점심 뒤에는 해안에서 한 블록 안쪽의 동네를 걷고, 해가 낮아질 때 다시 물가로 돌아옵니다.</p>` },
  packing: { kicker: '여행 준비 · 3분', title: '가벼운 여행 가방을 꾸리는 기준', body: `<p><strong>이 글은 SIIII.TR의 샘플 매거진 콘텐츠입니다.</strong></p><p>‘혹시 필요할 것’보다 ‘하루에 반드시 쓸 것’을 먼저 적어보세요. 걷기 편한 신발, 날씨에 맞는 겉옷, 물과 작은 가방이면 짧은 국내 여행의 기본은 충분합니다. 남는 공간은 그곳에서 발견할 작은 기억을 위해 비워둡니다.</p>` }
};
function openDialog(data) {
  $('#dialog-kicker').textContent = data.kicker;
  $('#dialog-title').textContent = data.title;
  $('#dialog-body').innerHTML = data.body;
  contentDialog?.showModal();
  body.classList.add('modal-open');
}
function closeDialog(dialog) { dialog.close(); body.classList.remove('modal-open'); }
document.addEventListener('click', event => {
  const detail = event.target.closest('.detail-trigger');
  const article = event.target.closest('.article-trigger');
  if (detail && placeData[detail.dataset.place]) openDialog(placeData[detail.dataset.place]);
  if (article && articleData[article.dataset.article]) openDialog(articleData[article.dataset.article]);
  if (event.target.closest('[data-close-dialog]') && contentDialog) closeDialog(contentDialog);
});
$$('.dialog-close').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); }));

// 검색창에서 입력한 키워드와 여행지 설명을 비교해 결과를 표시합니다.
const searchPanel = $('.search-panel');
const searchInput = $('#site-search');
const searchResults = $('#search-results');
function setSearch(open) { if (!searchPanel) return; searchPanel.hidden = !open; body.classList.toggle('modal-open', open); if (open) setTimeout(() => searchInput.focus(), 50); }
$('.search-open')?.addEventListener('click', () => setSearch(true));
$('.search-close')?.addEventListener('click', () => setSearch(false));
const destinationCards = $$('.destination-card');
function runSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { searchResults.textContent = '검색어를 입력해 주세요.'; return; }
  const matches = destinationCards.filter(card => card.dataset.search.toLowerCase().includes(query));
  if (query === '산' || ['내장산','자연','단풍'].some(word => word.includes(query) || query.includes(word))) matches.unshift({ dataset: { place: 'naejangsan' }, querySelector: () => ({ textContent: '내장산' }) });
  searchResults.innerHTML = matches.length ? matches.map(card => `<button class="search-result-button" data-result="${card.dataset.place || card.querySelector('.detail-trigger').dataset.place}">${card.querySelector('h3')?.textContent || '내장산'}의 여행 정보 보기 →</button>`).join('') : '일치하는 여행지를 찾지 못했습니다. “바다”, “골목”, “자연”처럼 검색해 보세요.';
}
$('#search-submit')?.addEventListener('click', runSearch);
searchInput?.addEventListener('keydown', event => { if (event.key === 'Enter') runSearch(); if (event.key === 'Escape') setSearch(false); });
searchResults?.addEventListener('click', event => { const button = event.target.closest('[data-result]'); if (button) { setSearch(false); openDialog(placeData[button.dataset.result]); } });

// 여행 기분을 선택하면 사진, 여행지, 설명과 상세 연결이 함께 변경됩니다.
const moodData = {
  nature: { place:'naejangsan', kicker:'추천 여행지 · 내장산', name:'고요한 숲에서 찾는 쉼', description:'단풍 숲을 천천히 걷고, 좋아하는 풍경 앞에서 오래 머물러 보세요.' },
  sea: { place:'yeosu', kicker:'추천 여행지 · 여수', name:'섬과 바다 사이의 여유', description:'오동도의 바닷길과 남해의 섬 풍경을 바라보며 서두르지 않는 하루를 보냅니다.' },
  alley: { place:'daegu', kicker:'추천 여행지 · 대구', name:'도시의 결을 따라 걷기', description:'팔공산의 넓은 전망과 오래된 도심 골목을 이어 걸으며 로컬의 시간을 발견합니다.' },
  food: { place:'seoul', kicker:'추천 여행지 · 서울', name:'한 동네를 맛으로 기억하기', description:'한 지역을 정해 시장과 작은 식당을 천천히 탐색하고 도시의 새로운 표정을 만납니다.' }
};
$$('.mood-options button').forEach(button => button.addEventListener('click', () => {
  $$('.mood-options button').forEach(item => item.setAttribute('aria-selected', 'false'));
  button.setAttribute('aria-selected', 'true');
  const data = moodData[button.dataset.mood];
  $('#mood-kicker').textContent = data.kicker; $('#mood-name').textContent = data.name; $('#mood-description').textContent = data.description;
  $('#mood-detail').dataset.place = data.place;
}));

// 후기 슬라이더: 자동 전환, 버튼, 키보드, 터치 스와이프를 모두 지원합니다.
const slider = $('.review-slider');
const slides = $$('.review-slide');
const dots = $('.slider-dots');
let currentSlide = 0, autoplay;
slides.forEach((_, index) => { const dot = document.createElement('button'); dot.type='button'; dot.setAttribute('role','tab'); dot.setAttribute('aria-label',`${index + 1}번째 후기`); dot.addEventListener('click', () => showSlide(index)); dots?.append(dot); });
function showSlide(index) { currentSlide = (index + slides.length) % slides.length; slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide)); $$('button', dots).forEach((dot, i) => dot.setAttribute('aria-selected', String(i === currentSlide))); }
function stopAutoplay() { clearInterval(autoplay); }
function startAutoplay() { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; stopAutoplay(); autoplay = setInterval(() => showSlide(currentSlide + 1), 5500); }
$('.slider-prev')?.addEventListener('click', () => showSlide(currentSlide - 1)); $('.slider-next')?.addEventListener('click', () => showSlide(currentSlide + 1));
if (slider) {
  slider.addEventListener('mouseenter', stopAutoplay); slider.addEventListener('mouseleave', startAutoplay); slider.addEventListener('focusin', stopAutoplay); slider.addEventListener('focusout', startAutoplay);
  slider.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showSlide(currentSlide - 1); if (event.key === 'ArrowRight') showSlide(currentSlide + 1); });
  let touchStart = 0; slider.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; stopAutoplay(); }, { passive:true }); slider.addEventListener('touchend', event => { const diff = event.changedTouches[0].clientX - touchStart; if (Math.abs(diff) > 45) showSlide(currentSlide + (diff < 0 ? 1 : -1)); startAutoplay(); }, { passive:true });
  showSlide(0); startAutoplay();
}
$('.more-review-button')?.addEventListener('click', event => { const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true'; event.currentTarget.setAttribute('aria-expanded', String(!expanded)); $('.more-reviews').hidden = expanded; event.currentTarget.innerHTML = expanded ? '후기 더 보기 <span>＋</span>' : '후기 접기 <span>−</span>'; });

// 예약 페이지는 입력 → 내용 확인 → 데모 완료의 3단계로 진행됩니다.
const form = $('#plan-form');
const dateInput = $('#date');
const requestInput = $('#request');
function setError(input, message) { const wrapper = input.closest('.field,.agreement'); wrapper?.classList.toggle('invalid', Boolean(message)); const error = wrapper?.querySelector('.error'); if (error) error.textContent = message; }
function validateForm() {
  let valid = true;
  [['#destination','여행지를 선택해 주세요.'],['#date','출발 날짜를 선택해 주세요.'],['#name','이름을 입력해 주세요.'],['#phone','연락처를 입력해 주세요.'],['#email','이메일을 입력해 주세요.']].forEach(([selector,message]) => { const input=$(selector); if (!input) return; const error=!input.value.trim()?message:''; setError(input,error); if(error) valid=false; });
  const phone = $('#phone'); if (phone.value && !/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(phone.value)) { setError(phone,'올바른 연락처 형식으로 입력해 주세요.'); valid=false; }
  const email = $('#email'); if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError(email,'올바른 이메일 형식으로 입력해 주세요.'); valid=false; }
  const date = dateInput; if (date.value && date.value < date.min) { setError(date,'오늘 이후 날짜를 선택해 주세요.'); valid=false; }
  const tripType = $('input[name="tripType"]:checked'); const tripError = $('fieldset .error'); tripError.textContent = tripType ? '' : '여행 유형을 선택해 주세요.'; if(!tripType) valid=false;
  const privacy = $('#privacy'); setError(privacy, privacy.checked ? '' : '개인정보 수집 및 이용 동의가 필요합니다.'); if(!privacy.checked) valid=false;
  return valid;
}
if (form) {
  dateInput.min = new Date().toISOString().split('T')[0];
  requestInput.addEventListener('input', () => { if (requestInput.value.length > 500) requestInput.value = requestInput.value.slice(0,500); requestInput.parentElement.querySelector('.count').textContent = `${requestInput.value.length} / 500`; });
  const confirmSection = $('#reservation-confirm');
  const completeSection = $('#reservation-complete');
  const stepLabels = $$('.form-steps li');
  const setReservationStep = step => stepLabels.forEach((label, index) => label.classList.toggle('active', index + 1 === step));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status=$('.form-status');
    if(!validateForm()){ status.textContent='입력 내용을 다시 확인해 주세요.'; $('.invalid input,.invalid select')?.focus(); return; }
    status.textContent='';
    const data=new FormData(form);
    const rows = [
      ['여행지', data.get('destination')], ['출발 날짜', data.get('date')],
      ['인원', `성인 ${data.get('adults')}명${Number(data.get('children')) ? ` · 어린이 ${data.get('children')}명` : ''}`],
      ['여행 유형', data.get('tripType')], ['이름', data.get('name')],
      ['연락처', data.get('phone')], ['이메일', data.get('email')],
      ['요청 사항', data.get('request') || '없음']
    ];
    $('#confirmation-list').innerHTML = rows.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
    form.hidden = true; confirmSection.hidden = false; setReservationStep(2); confirmSection.focus?.();
    scrollTo({top: $('.reservation-form-section').offsetTop - 40, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  });
  $('#edit-reservation')?.addEventListener('click', () => { confirmSection.hidden=true; form.hidden=false; setReservationStep(1); $('#destination').focus(); });
  $('#confirm-reservation')?.addEventListener('click', () => { confirmSection.hidden=true; completeSection.hidden=false; setReservationStep(3); completeSection.focus?.(); });
  $('#new-reservation')?.addEventListener('click', () => { completeSection.hidden=true; form.hidden=false; form.reset(); dateInput.min=new Date().toISOString().split('T')[0]; requestInput.parentElement.querySelector('.count').textContent='0 / 500'; setReservationStep(1); $('#destination').focus(); });
}

// 개인정보 안내 모달을 여는 버튼은 헤더와 푸터에서 공통으로 사용합니다.
const privacyDialog = $('#privacy-dialog');
$$('.privacy-open').forEach(button => button.addEventListener('click', () => { privacyDialog.showModal(); body.classList.add('modal-open'); }));

// 화면에 들어온 요소를 가볍게 나타냅니다. 동작 줄이기 설정에서는 즉시 표시합니다.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold:.12 });
  $$('.reveal').forEach(element => observer.observe(element));
} else { $$('.reveal').forEach(element => element.classList.add('visible')); }

// ESC 키로 검색 패널이나 모바일 메뉴를 닫습니다.
addEventListener('keydown', event => { if(event.key === 'Escape'){ if(searchPanel && !searchPanel.hidden) setSearch(false); if(mobileMenu && !mobileMenu.hidden) setMenu(false); } });
