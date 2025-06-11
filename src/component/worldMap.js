// 국가 클릭 이벤트 처리
document.addEventListener('DOMContentLoaded', function() {
    const states = document.querySelectorAll('.sm_state');
    
    states.forEach(state => {
        state.addEventListener('mouseover', function() {
            this.style.fill = '#3C3B6E';
        });
        
        state.addEventListener('mouseout', function() {
            this.style.fill = '#88a4bc';
        });
        
        state.addEventListener('click', function() {
            const countryCode = this.classList[1].split('_')[2];
            // 국가 코드를 기반으로 추가 동작 수행
            console.log('Selected country:', countryCode);
        });
    });
}); 