
const recipes=[
    {
        recipe:"500g potatoes 100g milk 50g butter"
    },
    {
        recipe:"1kg minced beef"
    },
    {
        recipe:"1.2 kg chicken"
    },
    {
        recipe:"500g rice"
    }

]
import { NextResponse } from "next/server"

export async function GET(){
    return NextResponse.json(recipes);
}