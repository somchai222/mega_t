const slide = document.querySelector('.slide');
let isScrolling = false; 
let startX = 0; 
let endX = 0;   

const applyItemImages = () => {
    const items = document.querySelectorAll('.item');

    items.forEach((item) => {
        const thumbImage = item.style.backgroundImage || getComputedStyle(item).backgroundImage;
        const bgImage = item.dataset.bg;

        if (thumbImage && thumbImage !== 'none') {
            item.style.setProperty('--thumb-image', thumbImage);
        }

        if (bgImage) {
            item.style.setProperty('--bg-image', `url('${bgImage}')`);
        } else if (thumbImage && thumbImage !== 'none') {
            item.style.setProperty('--bg-image', thumbImage);
        }

        // Remove inline background-image so CSS rules can switch between thumb and bg.
        item.style.backgroundImage = '';
    });
};

applyItemImages();
// ==========================================
// 🌟 ระบบตัวนับ (Counter) ว่ามีกี่รูป
// ==========================================
const allItemsInitial = document.querySelectorAll('.item');
const totalItems = allItemsInitial.length;

// ฝังหมายเลขดั้งเดิมไว้ในแต่ละรูป
allItemsInitial.forEach((item, index) => {
    item.dataset.index = index + 1;
});

// สร้างกล่อง HTML สำหรับแสดงตัวเลข
const counter = document.createElement('div');
counter.className = 'slide-counter';
document.querySelector('.container').appendChild(counter);

// ฟังก์ชันสำหรับอัปเดตตัวเลข (อิงจากรูปพื้นหลังหลักที่แสดงอยู่)
const updateCounter = () => {
    const currentBg = document.querySelectorAll('.item')[1]; // รูปที่ 2 ของ DOM คือแบคกราวนด์หลัก
    if (currentBg) {
        counter.innerText = `${currentBg.dataset.index} / ${totalItems}`;
    }
};
updateCounter(); 


// ==========================================
// ส่วนที่ 1: ระบบคลิกเพื่อเลือก (หมุนวงกลมทั้ง 6 รูป)
// ==========================================
slide.addEventListener('click', function(e) {
    const item = e.target.closest('.item');
    if (Math.abs(startX - endX) > 10) return; 

    if (item) {
        const items = Array.from(document.querySelectorAll('.item'));
        const index = items.indexOf(item);

        // ถ้าคลิกรูปที่ไม่ใช่รูป background หลัก (index 1)
        if (index !== 1) {
            // หมุนรูปให้รูปที่คลิกไปยังตำแหน่ง index 1
            while (items.indexOf(document.querySelectorAll('.item')[index]) !== 1 && item) {
                const currentItems = document.querySelectorAll('.item');
                const currentIndex = Array.from(currentItems).indexOf(item);
                
                if (currentIndex > 1) {
                    slide.appendChild(currentItems[0]); // หมุนจากต้นมาท้าย
                } else {
                    break;
                }
            }
            
            updateCounter(); 
        }
    }
});

slide.style.userSelect = 'none';
slide.addEventListener('dragstart', (e) => e.preventDefault());


// ==========================================
// ส่วนที่ 2: ระบบลาก / ปัด (หมุนเป็นวงกลมทั้ง 6 รูป)
// ==========================================
const handleDrag = () => {
    if (isScrolling) return; 
    const threshold = 50; 
    const diffX = startX - endX;
    const currentItems = document.querySelectorAll('.item');

    if (Math.abs(diffX) > threshold) {
        isScrolling = true;

        if (diffX > 0) {
            // ลากซ้าย: นำรูปแรก (index 0) ไปต่อท้ายสุด เพื่อทำให้วงกลมหมุน
            slide.appendChild(currentItems[0]);
        } else {
            // ลากขวา: นำรูปท้ายสุด มาไว้หน้าสุด เพื่อทำให้วงกลมหมุนกลับ
            slide.insertBefore(currentItems[currentItems.length - 1], currentItems[0]);
        }

        updateCounter();

        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }
};

slide.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
slide.addEventListener('touchend', (e) => { endX = e.changedTouches[0].clientX; handleDrag(); });
slide.addEventListener('mousedown', (e) => { startX = e.clientX; slide.style.cursor = 'grabbing'; });
slide.addEventListener('mouseup', (e) => { endX = e.clientX; slide.style.cursor = 'pointer'; handleDrag(); });
slide.addEventListener('mouseleave', () => { slide.style.cursor = 'pointer'; });


// ==========================================
// ส่วนที่ 3: ระบบ Scroll ลูกกลิ้ง (หมุนวงกลมทั้ง 6 รูป)
// ==========================================
slide.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true; 

    const currentItems = document.querySelectorAll('.item');

    if (e.deltaY > 0) {
        // เลื่อนลง: นำรูปแรก (index 0) ไปต่อท้ายสุด
        slide.appendChild(currentItems[0]); 
    } else {
        // เลื่อนขึ้น: นำรูปท้ายสุด มาไว้หน้าสุด
        slide.insertBefore(currentItems[currentItems.length - 1], currentItems[0]); 
    }

    updateCounter();

    setTimeout(() => {
        isScrolling = false; 
    }, 600); 

}, { passive: false });
