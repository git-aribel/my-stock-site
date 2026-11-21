import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasDownloadAccess } from "@/lib/access";

// Boards are a members feature. Row level security also keeps each
// person's boards private.
async function member() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: NextResponse.json({ code: "login" }, { status: 401 }) };
  if (!(await hasDownloadAccess(supabase, user.id))) {
    return { supabase, error: NextResponse.json({ code: "subscribe" }, { status: 403 }) };
  }
  return { supabase, error: null };
}

// GET /api/boards?item=<id>: the member's boards, and which contain the item
export async function GET(request: Request) {
  const { supabase, error } = await member();
  if (error) return error;

  const itemId = new URL(request.url).searchParams.get("item");
  const { data: boards, error: dbError } = await supabase
    .from("boards")
    .select("id, name, board_items(item_id)")
    .order("created_at");
  if (dbError) {
    console.error(dbError);
    return NextResponse.json({ error: "Boards aren't available right now." }, { status: 500 });
  }

  return NextResponse.json({
    boards: (boards ?? []).map((b) => ({
      id: b.id,
      name: b.name,
      count: b.board_items.length,
      hasItem: !!itemId && b.board_items.some((i) => i.item_id === itemId),
    })),
  });
}

// POST /api/boards { action, ... }
export async function POST(request: Request) {
  const { supabase, error } = await member();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";

  switch (body.action) {
    case "create": {
      if (!name) return NextResponse.json({ error: "Give your board a name." }, { status: 400 });
      const { data: board, error: e } = await supabase.from("boards").insert({ name }).select("id").single();
      if (e || !board) return NextResponse.json({ error: "Couldn't create the board." }, { status: 500 });
      if (typeof body.itemId === "string") {
        await supabase.from("board_items").insert({ board_id: board.id, item_id: body.itemId });
      }
      return NextResponse.json({ id: board.id });
    }
    case "toggle": {
      const { boardId, itemId, on } = body;
      if (typeof boardId !== "string" || typeof itemId !== "string") {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }
      const { error: e } = on
        ? await supabase.from("board_items").upsert({ board_id: boardId, item_id: itemId }, { ignoreDuplicates: true })
        : await supabase.from("board_items").delete().eq("board_id", boardId).eq("item_id", itemId);
      if (e) return NextResponse.json({ error: "Couldn't update the board." }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "rename": {
      if (!name || typeof body.boardId !== "string") {
        return NextResponse.json({ error: "Give your board a name." }, { status: 400 });
      }
      const { error: e } = await supabase.from("boards").update({ name }).eq("id", body.boardId);
      if (e) return NextResponse.json({ error: "Couldn't rename the board." }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    case "delete": {
      if (typeof body.boardId !== "string") return NextResponse.json({ error: "Bad request" }, { status: 400 });
      const { error: e } = await supabase.from("boards").delete().eq("id", body.boardId);
      if (e) return NextResponse.json({ error: "Couldn't delete the board." }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
