const brands = [
    "Patagonia", "Liquid Death", "IKEA", "Spotify", "Nintendo", 
    "Tesla", "Glossier", "LEGO", "Nike", "NASA", 
    "Red Bull", "YETI", "Apple", "Disney", "Muji", "Casper"
];

const products = [
    "Mental Health App", "Reusable Water Bottle", "Luxury Hotel Chain", 
    "Sustainable Deodorant", "Smart Glasses", "Community Garden", 
    "Electric Unicycle", "Pet Insurance", "Streetwear Line", 
    "Budget Airline", "Premium Coffee Brand", "Cooking School"
];

function spinCampaign() {
    const brandEl = document.getElementById('brand-slot');
    const productEl = document.getElementById('product-slot');
    const missionBox = document.getElementById('mission-box');
    const missionText = document.getElementById('mission-text');
    const btn = document.getElementById('campaignBtn');

    // UI Reset
    btn.disabled = true;
    btn.innerText = "Generating Mashup...";
    missionBox.style.display = "none";
    
    brandEl.classList.remove('selected');
    productEl.classList.remove('selected');
    
    brandEl.classList.add('spinning');
    productEl.classList.add('spinning');
    
    brandEl.innerText = "???";
    productEl.innerText = "???";

    // 1. Reveal Brand (Quickly - 1.2 seconds)
    setTimeout(() => {
        brandEl.classList.remove('spinning');
        brandEl.classList.add('selected');
        brandEl.innerText = brands[Math.floor(Math.random() * brands.length)];
    }, 1200);

    // 2. Reveal Product (After a long dramatic pause - 4.5 seconds total)
    setTimeout(() => {
        productEl.classList.remove('spinning');
        productEl.classList.add('selected');
        productEl.innerText = products[Math.floor(Math.random() * products.length)];
        
        // Final Mission Text
        missionBox.style.display = "block";
        missionText.innerHTML = `Develop a strategic multi-platform campaign for <strong>${brandEl.innerText}</strong> as they expand into the <strong>${productEl.innerText}</strong> market.`;
        
        // Reset Button
        btn.disabled = false;
        btn.innerText = "Spin Again";
        
        // Optional: Small confetti burst for the mashup reveal
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#CC0000', '#111111']
        });
    }, 4500); 
}
