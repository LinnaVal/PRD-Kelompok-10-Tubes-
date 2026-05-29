import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path"


export async function PUT(req: NextRequest) {
    const { tenantID, menuID } = await req.json();
    
    const filePath = path.join(process.cwd(), "data", "menuTb3.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    const tenant =  data.toko.find((t: any) => t.tenantID === tenantID);
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    const item = tenant.menu.find((m: any) => m.id === menuID);
    if (!item) return NextResponse.json({ error: "Menu not found" }, { status: 404 });

    item.stock = item.stock === "stok ada" ? "stok habis" : "stok ada";

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, stock: item.stock });
}