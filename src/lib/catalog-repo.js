import { getPool, isPostgresEnabled } from "./db";
import {
  BRANCHES,
  MENU_ITEMS,
  normalizeText,
  getMenuItemUrl,
} from "./restaurant-store";

function menuRowToItem(row) {
  let tags = row.tags;
  if (tags && typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = [];
    }
  }
  if (!Array.isArray(tags)) tags = [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    price: Number(row.price),
    tags,
    imageUrl: row.image_url,
    description: row.description,
    isHot: row.is_hot,
  };
}

function branchRowToBranch(row) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    openHours: row.open_hours,
  };
}

/** Danh sách chi nhánh (API + trang đặt bàn). */
export async function getBranchesList() {
  if (!isPostgresEnabled()) {
    return [...BRANCHES];
  }
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, name, address, phone, open_hours
     FROM branches
     ORDER BY sort_order ASC, id ASC`,
  );
  return rows.map(branchRowToBranch);
}

/** Một chi nhánh hoặc null (slots, đặt bàn). */
export async function findBranchById(branchId) {
  const bid = normalizeText(branchId);
  if (!isPostgresEnabled()) {
    return BRANCHES.find((b) => normalizeText(b.id) === bid) ?? null;
  }
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, name, address, phone, open_hours FROM branches WHERE id = $1`,
    [bid],
  );
  return rows[0] ? branchRowToBranch(rows[0]) : null;
}

async function loadAllMenuItems() {
  if (!isPostgresEnabled()) {
    return [...MENU_ITEMS];
  }
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, slug, name, category, category_label, price, tags, image_url, description, is_hot
     FROM menu_items
     ORDER BY sort_order ASC, id ASC`,
  );
  return rows.map(menuRowToItem);
}

/** GET /api/menu — lọc giống logic cũ. */
export async function listMenuItemsFiltered({ category, search, maxPrice }) {
  let list = await loadAllMenuItems();

  if (category) {
    list = list.filter((item) => normalizeText(item.category) === category);
  }
  if (search) {
    list = list.filter((item) => {
      return (
        normalizeText(item.name).includes(search) ||
        normalizeText(item.description).includes(search) ||
        item.tags.some((tag) => normalizeText(tag).includes(search))
      );
    });
  }
  if (maxPrice > 0) {
    list = list.filter((item) => Number(item.price) <= maxPrice);
  }

  return list;
}

/** GET /api/menu/hot */
export async function listHotMenuItems(limit) {
  const cap = Math.min(Number(limit) || 6, 20);
  let list = await loadAllMenuItems();
  list = list.filter((item) => item.isHot).slice(0, cap);
  return list;
}

/** GET /api/menu/[slug] */
export async function getMenuItemBySlug(slug) {
  const s = String(slug || "").trim();
  if (!isPostgresEnabled()) {
    return MENU_ITEMS.find((x) => x.slug === s) ?? null;
  }
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, slug, name, category, category_label, price, tags, image_url, description, is_hot
     FROM menu_items WHERE slug = $1`,
    [s],
  );
  return rows[0] ? menuRowToItem(rows[0]) : null;
}

/** Trang /thuc-don — toàn bộ món, đúng thứ tự sort_order. */
export async function listAllMenuItems() {
  return loadAllMenuItems();
}

/** Gắn url cho từng món (API). */
export function withMenuUrls(items, origin) {
  return items.map((item) => ({
    ...item,
    url: getMenuItemUrl(origin, item.slug),
  }));
}
