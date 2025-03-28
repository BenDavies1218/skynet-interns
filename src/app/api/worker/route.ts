import Worker from "@/app/models/worker";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {   
    await dbConnect();
    const workers = await Worker.find();
    return NextResponse.json(workers);
}

export async function POST(request: Request) {
    await dbConnect();

    debugger;

    console.log("POST request received", request);

    // console.log("POST request body", request.body);

    const body = await request.json();

    console.log("POST request body", body.body);
    const worker = await Worker.create(body.body);
    return NextResponse.json(worker);
}