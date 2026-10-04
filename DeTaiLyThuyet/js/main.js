// ===== Dữ liệu mẫu =====
const SP = [
    { id: 1, n: "Sổ tay bìa da A5", c: "so-tay", p: 85000, e: "📒", d: "Sổ tay bìa da PU, 200 trang giấy kem." },
    { id: 2, n: "Sổ lò xo kẻ ngang", c: "so-tay", p: 35000, e: "📓", d: "Sổ lò xo A5, 100 trang, bìa cứng." },
    { id: 3, n: "Sổ planner 2026", c: "so-tay", p: 99000, e: "📅", d: "Sổ lên kế hoạch theo ngày, tuần, tháng." },
    { id: 4, n: "Bút bi xanh (hộp 10)", c: "but", p: 45000, e: "🖊️", d: "Mực xanh ra đều, viết êm." },
    { id: 5, n: "Bút gel đen 0.5mm", c: "but", p: 12000, e: "✒️", d: "Ngòi 0.5mm, khô nhanh, không lem." },
    { id: 6, n: "Bộ bút highlight 6 màu", c: "but", p: 55000, e: "🖍️", d: "6 màu pastel nhẹ nhàng, dễ đọc." },
    { id: 7, n: "Hộp bút vải canvas", c: "dung-cu", p: 48000, e: "🎒", d: "Hộp bút vải chống nước, khóa kéo chắc chắn." },
    { id: 8, n: "Thước kẻ + Ê-ke", c: "dung-cu", p: 25000, e: "📏", d: "Bộ thước nhựa trong 20cm." },
    { id: 9, n: "Kéo & băng keo trang trí", c: "dung-cu", p: 38000, e: "✂️", d: "Kéo inox kèm 5 cuộn washi tape." },
    { id: 10, n: "Móc khóa gấu bông", c: "qua-luu-niem", p: 30000, e: "🧸", d: "Móc khóa gấu bông nhỏ xinh." },
    { id: 11, n: "Hộp quà mini", c: "qua-luu-niem", p: 65000, e: "🎁", d: "Hộp quà kèm thiệp viết tay." },
    { id: 12, n: "Cốc sứ in hình", c: "qua-luu-niem", p: 79000, e: "☕", d: "Cốc sứ 350ml, có thể in tên theo yêu cầu." }
];
const CB = [
    { id: 101, n: "Combo Back to School", items: ["1 sổ tay A5", "3 bút bi", "1 hộp bút"], old: 200000, p: 159000, e: "🎓" },
    { id: 102, n: "Combo Văn phòng", items: ["1 sổ planner", "2 bút gel", "1 bộ highlight"], old: 190000, p: 149000, e: "💼" },
    { id: 103, n: "Combo Quà tặng", items: ["1 hộp quà mini", "1 cốc sứ", "1 móc khóa"], old: 180000, p: 139000, e: "💝" },
    { id: 104, n: "Combo Sinh viên", items: ["2 sổ lò xo", "1 hộp bút", "1 thước kẻ"], old: 140000, p: 109000, e: "📚" }
];
const ALL = SP.concat(CB);
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString("vi-VN") + "đ";

// ===== Tài khoản =====
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const currentUser = () => {
    const e = localStorage.getItem("currentUser");
    return getUsers().find(u => u.email === e) || null;
};
function logout() { localStorage.removeItem("currentUser"); location.href = "/Home/Index"; }
function renderAuth() {
    const link = document.querySelector('nav a[href="/Account/DangNhap"]');
    const u = currentUser();
    if (!link || !u) return;
    link.textContent = "👤 " + u.name;
    link.href = "#";
    const out = document.createElement("a");
    out.href = "#"; out.textContent = "Đăng xuất";
    out.onclick = e => { e.preventDefault(); logout(); };
    link.after(out);
    const od = document.createElement("a");
    od.href = "/Order/DonHang"; od.textContent = "📦 Đơn hàng";
    link.after(od);
}
function requireLogin() {
    if (currentUser()) return true;
    alert("Vui lòng đăng nhập để mua hàng!");
    const back = location.pathname.split("/").pop() + location.search;
    location.href = "/Account/DangNhap?next=" + encodeURIComponent(back);
    return false;
}
function goNext() {
    const n = new URLSearchParams(location.search).get("next");
    location.href = n ? n : "/Product/SanPham";
}

// ===== Giỏ hàng =====
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = c => { localStorage.setItem("cart", JSON.stringify(c)); updateCount(); };
function updateCount() { $("cart-count").textContent = getCart().reduce((s, i) => s + i.qty, 0); }
function add(id) {
    if (!requireLogin()) return;
    const cart = getCart(), it = cart.find(i => i.id === id);
    it ? it.qty++ : cart.push({ id, qty: 1 });
    saveCart(cart); alert("Đã thêm vào giỏ hàng!");
}
function setQty(id, q) { const cart = getCart(); cart.find(i => i.id === id).qty = Math.max(1, +q || 1); saveCart(cart); renderCart(); }
function removeItem(id) { saveCart(getCart().filter(i => i.id !== id)); renderCart(); }
const total = () => getCart().reduce((s, i) => s + ALL.find(x => x.id === i.id).p * i.qty, 0);

// ===== Voucher =====
const VC = {
    "GIAM10": { type: "pct", v: 10, note: "Giảm 10% toàn đơn" },
    "GIAM20K": { type: "fix", v: 20000, note: "Giảm 20.000đ" },
    "SV50": { type: "fix", v: 50000, min: 300000, note: "Giảm 50.000đ cho đơn từ 300.000đ" }
};
const getVoucher = () => localStorage.getItem("voucher") || "";
function discount() {
    const v = VC[getVoucher()]; if (!v) return 0;
    const t = total();
    if (v.min && t < v.min) return 0;
    return Math.min(t, v.type === "pct" ? Math.round(t * v.v / 100) : v.v);
}
const finalTotal = () => total() - discount();
function applyVoucher() {
    const code = $("vc-input").value.trim().toUpperCase();
    const v = VC[code];
    if (!v) { $("vc-msg").textContent = "Mã không hợp lệ!"; return; }
    if (v.min && total() < v.min) { $("vc-msg").textContent = "Đơn hàng chưa đủ " + fmt(v.min) + " để dùng mã này."; return; }
    localStorage.setItem("voucher", code); renderCart();
}
function removeVoucher() { localStorage.removeItem("voucher"); renderCart(); }
function useVoucher(code) { $("vc-input").value = code; applyVoucher(); }
function renderVoucherList() {
    if (!$("vc-list")) return;
    const cur = getVoucher(), t = total();
    $("vc-list").innerHTML = Object.keys(VC).map(code => {
        const v = VC[code];
        const ok = !v.min || t >= v.min;
        const btn = code === cur && discount() > 0
            ? '<button type="button" disabled>Đang dùng</button>'
            : ok ? `<button type="button" onclick="useVoucher('${code}')">Dùng mã</button>`
                : '<button type="button" disabled>Chưa đủ điều kiện</button>';
        return `<div class="vc-item${ok ? "" : " off"}"><div><strong>${code}</strong><p>${v.note}</p></div>${btn}</div>`;
    }).join("");
}

// ===== Đơn hàng =====
const getOrders = () => JSON.parse(localStorage.getItem("orders") || "[]");
function placeOrder(info) {
    const u = currentUser();
    const order = {
        id: "DH" + Date.now().toString().slice(-6),
        email: u.email,
        date: new Date().toLocaleString("vi-VN"),
        items: getCart().map(i => {
            const x = ALL.find(p => p.id === i.id);
            return { id: x.id, n: x.n, p: x.p, e: x.e, qty: i.qty };
        }),
        sub: total(), disc: discount(), voucher: discount() ? getVoucher() : "",
        total: finalTotal(), name: info.name, phone: info.phone, address: info.address, pay: info.pay
    };
    const all = getOrders(); all.push(order);
    localStorage.setItem("orders", JSON.stringify(all));
}
function renderOrders() {
    const u = currentUser();
    const mine = getOrders().filter(o => o.email === u.email).reverse();
    if (!mine.length) {
        $("orders").innerHTML = '<p>Bạn chưa có đơn hàng nào.</p><a class="btn" href="san-pham.html">Mua sắm ngay</a>';
        return;
    }
    $("orders").innerHTML = mine.map(o => `
    <section class="order">
      <div class="order-head"><strong>Mã đơn: ${o.id}</strong><span>${o.date}</span><span class="status">Đang xử lý</span></div>
      ${o.items.map(i => `
        <div class="order-item">
          <img src="/Content/images/${x.id}.jpg" alt="${i.n}" onerror="this.outerHTML='<div class=thumb-s>${i.e}</div>'">
          <div><h3>${i.n}</h3><p>Số lượng: ${i.qty}</p></div>
          <p>${fmt(i.p * i.qty)}</p>
        </div>`).join("")}
      <div class="order-foot">
        <p>Giao tới: ${o.name} - ${o.phone} - ${o.address}</p>
        <p>Thanh toán: ${o.pay === "ck" ? "Chuyển khoản" : "Thanh toán khi nhận hàng"}</p>
        <p>Tạm tính: ${fmt(o.sub)}</p>
        ${o.disc ? `<p>Voucher ${o.voucher}: -${fmt(o.disc)}</p>` : ""}
        <p class="price">Tổng thanh toán: ${fmt(o.total)}</p>
      </div>
    </section>`).join("");
}

// ===== Hiển thị =====
function card(x) {
    const extra = x.items ? `<ul>${x.items.map(i => `<li>${i}</li>`).join("")}</ul><p><del>${fmt(x.old)}</del></p>` : "";
    return `<article class="card"><img src="/Content/images/${x.id}.jpg" alt="${x.n}" onerror="this.outerHTML='<div class=thumb>${x.e}</div>'"><h3>${x.n}</h3>${extra}
    <p class="price">${fmt(x.p)}</p>
    <a href="/Product/ChiTiet?id=${x.id}">Chi tiết</a><button type="button" onclick="add(${x.id})">Thêm vào giỏ</button></article>`;
}
function renderList() {
    const loai = $("loai").value, q = $("q").value.toLowerCase();
    const r = SP.filter(x => (!loai || x.c === loai) && x.n.toLowerCase().includes(q));
    $("list").innerHTML = r.length ? r.map(card).join("") : "<p>Không tìm thấy sản phẩm.</p>";
}
function renderDetail() {
    const x = ALL.find(i => i.id === +new URLSearchParams(location.search).get("id"));
    if (!x) { $("detail").innerHTML = "<p>Không tìm thấy sản phẩm.</p>"; return; }
    const info = x.items ? "Gồm: " + x.items.join(", ") : x.d;
    $("detail").innerHTML = `<div class="detail"><img src="/Content/images/${x.id}.jpg" alt="${x.n}" onerror="this.outerHTML='<div class=thumb>${x.e}</div>'"><div>
    <h2>${x.n}</h2><p>${info}</p><p class="price">${fmt(x.p)}</p>
    <button type="button" onclick="add(${x.id})">Thêm vào giỏ</button></div></div>`;
}
function renderCart() {
    const rows = getCart().map(i => {
        const x = ALL.find(p => p.id === i.id);
        return `<tr><td>${x.n}</td><td>${fmt(x.p)}</td>
      <td><input type="number" min="1" value="${i.qty}" onchange="setQty(${x.id},this.value)"></td>
      <td>${fmt(x.p * i.qty)}</td><td><button type="button" onclick="removeItem(${x.id})">X</button></td></tr>`;
    });
    $("cart-body").innerHTML = rows.join("") || '<tr><td colspan="5">Giỏ hàng trống</td></tr>';
    $("cart-sub").textContent = fmt(total());
    $("cart-discount").textContent = "-" + fmt(discount());
    $("cart-total").textContent = fmt(finalTotal());
    const c = getVoucher();
    $("vc-msg").textContent = (c && discount()) ? "Đã áp dụng " + c + ": " + VC[c].note : "";
    renderVoucherList();
}

// ===== Khởi chạy theo từng trang =====
updateCount();
renderAuth();

if ($("register-form")) {
    $("register-form").onsubmit = e => {
        e.preventDefault();
        const name = $("dk-ten").value.trim();
        const email = $("dk-mail").value.trim().toLowerCase();
        const pass = $("dk-mk").value;
        const users = getUsers();
        if (users.some(u => u.email === email)) { $("dk-msg").textContent = "Email này đã được đăng ký!"; return; }
        users.push({ name, email, pass });
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", email);
        alert("Đăng ký thành công! Bạn đã được đăng nhập.");
        goNext();
    };
}
if ($("login-form")) {
    $("login-form").onsubmit = e => {
        e.preventDefault();
        const email = $("dn-mail").value.trim().toLowerCase();
        const pass = $("dn-mk").value;
        const u = getUsers().find(x => x.email === email && x.pass === pass);
        if (!u) { $("dn-msg").textContent = "Email hoặc mật khẩu không đúng!"; return; }
        localStorage.setItem("currentUser", email);
        goNext();
    };
}
if ($("featured")) $("featured").innerHTML = SP.slice(0, 4).map(card).join("");
if ($("combos")) $("combos").innerHTML = CB.map(card).join("");
if ($("list")) {
    const p = new URLSearchParams(location.search);
    $("loai").value = p.get("loai") || "";
    $("q").value = p.get("q") || "";
    $("loai").onchange = $("q").oninput = renderList;
    renderList();
}
if ($("detail")) renderDetail();
if ($("cart-body")) renderCart();
if ($("orders") && requireLogin()) renderOrders();
if ($("checkout") && requireLogin()) {
    $("cart-total").textContent = fmt(finalTotal());
    const u = currentUser();
    $("hoten").value = u.name; $("email").value = u.email;
    $("checkout").onsubmit = e => {
        e.preventDefault();
        if (!getCart().length) { alert("Giỏ hàng đang trống!"); return; }
        placeOrder({
            name: $("hoten").value.trim(), phone: $("sdt").value.trim(),
            address: $("diachi").value.trim(), pay: $("ptttt").value
        });
        alert("Đặt hàng thành công! Cảm ơn bạn.");
        localStorage.removeItem("voucher");
        saveCart([]); location.href = "/Order/DonHang";
    };
}