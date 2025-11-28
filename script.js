let products = [
  {
    id: 1,
    nama: 'Laptop Dell XPS 13',
    kategori: 'Elektronik',
    harga: 12000000,
    stok: 5,
    status: 'Aktif',
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    nama: 'Buku Clean Code',
    kategori: 'Buku',
    harga: 250000,
    stok: 15,
    status: 'Aktif',
    imageUrl:
      'https://images.unsplash.com/photo-1507842072343-583f20270319?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    nama: 'Kemeja Formal',
    kategori: 'Fashion',
    harga: 150000,
    stok: 8,
    status: 'Aktif',
    imageUrl:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop',
  },
];

let productToDeleteId = null;
let isEditMode = false;
let editingProductId = null;

$(document).ready(function () {
  renderTable();
  updateStats();
  attachEventListeners();
});

function attachEventListeners() {
  // Sidebar Toggle
  $('#sidebarToggle, #sidebarOverlay').on('click', function () {
    $('.sidebar').toggleClass('show');
    $('#sidebarOverlay').toggleClass('show');
  });

  // Handle Form Submit (Jika user tekan Enter)
  $('#formProduk')
    .off('submit')
    .on('submit', function (e) {
      e.preventDefault();
      saveProduct();
    });

  // Handle Button Click
  $('#btnSimpan')
    .off('click')
    .on('click', function (e) {
      e.preventDefault();
      saveProduct();
    });

  // Search
  $('#searchProduk').on('keyup', function () {
    filterProducts($(this).val().toLowerCase());
  });

  // Reset Modal saat ditutup
  $('#modalTambahProduk').on('hidden.bs.modal', function () {
    isEditMode = false;
    $('#formProduk')[0].reset();
    $('#modalTitle').text('Tambah Produk');
    editingProductId = null;
  });

  // Delete Confirmation
  $('#btnKonfirmasiHapus').on('click', confirmDelete);
}

function renderTable() {
  const $tbody = $('#tableBody').empty();
  if (!products.length) {
    $tbody.html(
      '<tr><td colspan="8" class="text-center py-5 text-muted">Data kosong</td></tr>'
    );
    return;
  }

  products.forEach((p, i) => {
    const harga = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(p.harga);

    const badge =
      p.status === 'Aktif'
        ? 'bg-success text-success bg-opacity-10 border-success'
        : 'bg-secondary text-secondary bg-opacity-10 border-secondary';

    // PERBAIKAN: Menambahkan 'this.onerror=null' untuk mencegah infinite loop reload jika gambar placeholder juga gagal
    const imgTag = `<img src="${p.imageUrl}" class="product-img-small" onerror="this.onerror=null;this.src='https://via.placeholder.com/45'">`;

    $tbody.append(`
            <tr>
                <td class="ps-4 text-secondary">${i + 1}</td>
                <td>${imgTag}</td>
                <td class="fw-semibold">${p.nama}</td>
                <td class="text-secondary">${p.kategori}</td>
                <td class="fw-bold">${harga}</td>
                <td>${p.stok}</td>
                <td><span class="badge ${badge} border border-opacity-25 rounded-pill px-3 fw-normal">${
      p.status
    }</span></td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light me-1" onclick="openEdit(${
                      p.id
                    })"><i class="fas fa-pencil-alt text-muted"></i></button>
                    <button class="btn btn-sm btn-light" onclick="openDelete(${
                      p.id
                    })"><i class="fas fa-trash text-danger"></i></button>
                </td>
            </tr>
        `);
  });
  updateStats();
}

function updateStats() {
  $('#totalProdukDisplay').text(products.length);
  const activeCount = products.filter((p) => p.status === 'Aktif').length;
  $('#totalActiveDisplay').text(activeCount);
}

function saveProduct() {
  const data = {
    nama: $('#inputNama').val().trim(),
    kategori: $('#inputKategori').val(),
    harga: parseInt($('#inputHarga').val()),
    stok: parseInt($('#inputStok').val()),
    status: $('#inputStatus').val(),
    imageUrl: $('#inputGambar').val() || 'https://via.placeholder.com/100',
  };

  // Validasi Sederhana
  if (!data.nama || !data.kategori || isNaN(data.harga) || isNaN(data.stok)) {
    alert('Mohon lengkapi semua data wajib!');
    return;
  }

  if (isEditMode) {
    const idx = products.findIndex((p) => p.id === editingProductId);
    if (idx > -1) products[idx] = { id: editingProductId, ...data };
  } else {
    products.push({ id: Date.now(), ...data });
  }

  bootstrap.Modal.getInstance(
    document.getElementById('modalTambahProduk')
  ).hide();
  renderTable();
}

function openEdit(id) {
  isEditMode = true;
  editingProductId = id;
  const p = products.find((x) => x.id === id);
  if (p) {
    $('#inputNama').val(p.nama);
    $('#inputKategori').val(p.kategori);
    $('#inputHarga').val(p.harga);
    $('#inputStok').val(p.stok);
    $('#inputStatus').val(p.status);
    $('#inputGambar').val(p.imageUrl);
    $('#modalTitle').text('Edit Produk');
    new bootstrap.Modal(document.getElementById('modalTambahProduk')).show();
  }
}

function openDelete(id) {
  productToDeleteId = id;
  new bootstrap.Modal(document.getElementById('modalKonfirmasiHapus')).show();
}

function confirmDelete() {
  if (productToDeleteId) {
    products = products.filter((p) => p.id !== productToDeleteId);
    productToDeleteId = null;
    bootstrap.Modal.getInstance(
      document.getElementById('modalKonfirmasiHapus')
    ).hide();
    renderTable();
  }
}

function filterProducts(key) {
  $('#tableBody tr').each(function () {
    const text = $(this).text().toLowerCase();
    $(this).toggle(text.indexOf(key) > -1);
  });
}
