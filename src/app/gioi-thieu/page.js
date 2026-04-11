export const metadata = {
  title: "Giới thiệu",
};

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="container">
          <h1>Giới thiệu</h1>
          <p className="page-lead">
            Saigon Gourmet ra đời từ mong muốn mang đến bữa ăn chất lượng trong
            không gian gần gũi — nơi hương vị quê nhà hòa cùng kỹ thuật bếp hiện
            đại.
          </p>
        </div>
      </div>

      <div className="container section-block prose-block">
        <h2>Câu chuyện</h2>
        <p>
          Đội ngũ bếp chọn nguyên liệu theo mùa, ưu tiên nhà cung cấp trong nước
          và chế biến tại chỗ để giữ trọn độ tươi. Thực đơn kết hợp món Việt quen
          thuộc với một số lựa chọn Âu tinh giản, phù hợp cả gia đình lẫn tiệc
          nhỏ.
        </p>
        <h2>Không gian</h2>
        <p>
          Hai chi nhánh tại trung tâm Quận 1 và khu Phú Mỹ Hưng (Quận 7) với
          khu vực bàn rộng rãi, ánh sáng ấm. Phục vụ cả bữa trưa và tối; nên đặt
          bàn trước vào cuối tuần.
        </p>
        <h2>Cam kết</h2>
        <ul className="prose-list">
          <li>Nguyên liệu rõ nguồn, chế biến minh bạch.</li>
          <li>Phục vụ chu đáo, lắng nghe góp ý của khách.</li>
          <li>Luôn cập nhật thực đơn theo mùa và phản hồi khách hàng.</li>
        </ul>
      </div>
    </div>
  );
}
