

import { TextareaDisabled, TextareaWithButton } from "./button";

export default function Home() {

  return (
    <main
      style={{
        height: "100vh",
        backgroundImage: "linear-gradient(to bottom, #000000ff, rgba(20,18,73,1))",
        display: "flex",
        margin: "20px"
        //the main page style
      }}
    >
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "200px",
        gap: "20px",
        width: "40%",
      }}>

        <h1 style={{
          fontFamily: "Comic-sans",color: "GrayText",fontSize: "24px", margin: 0, }}
          >Enter your recipe's measurements + ingredients</h1>
        <div style={{ width: "590px" }}>
          <TextareaWithButton />
        </div>

      </div>


      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "200px",
        gap: "20px",
        width: "40%",
      }}>

        <h1 style={{
          fontFamily: "Comic-sans",color: "GrayText",fontSize: "24px", margin: 0, }}
          >The macros of your recipe /100g!</h1>
        <div style={{ width: "590px",height:"150px" }}>
          <TextareaDisabled />
        </div>

      </div>

    </main>



  );
}