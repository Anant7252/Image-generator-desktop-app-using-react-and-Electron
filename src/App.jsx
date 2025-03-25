import React, { useEffect, useState } from "react";
import "./App.css";
import { HashRouter as Router,Routes ,Route, Link } from "react-router-dom";
import { Download, Trash2 } from 'lucide-react';
import iconimage from './icon.ico'

function Image() {
  
  const [genetext, setGenetext] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [sorrytext,setsorrytext]=useState("");
  
  async function gene(data) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            
            Authorization: "your hugginr phase access token",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: data }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status} - ${error.error || "Unknown error"}`
        );
      }
      if (response.status === 429) {
        console.log("Rate limit exceeded, retrying in 60 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 10000)); 
        return gene(data); 
      }
  

      const result= await response.blob();
      return URL.createObjectURL(result);
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

  
  const generateing = (data) => {
    setImageUrl("")
    setLoading(true);
    gene(data).then((response) => {
      setLoading(false);
      if (response) {
        setImageUrl(response); 
      } else {
        setsorrytext("Sorry")
        console.error("Invalid response or no image generated.");
      }
    });
    setGenetext("")
  };
  
  const handledownload=()=>{
    const link=document.createElement('a');
    link.href=imageUrl
    link.download='image.jpg'
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className="relative flex flex-col items-center w-screen h-screen px-5 pt-16 pb-20 overflow-auto bg-zinc-900 no-scrollbar">
      
      <img src={iconimage} alt="hello "  className="absolute rounded-full top-2 left-5 size-10" />
      <h1 className="text-[50px] font-bold text-green-700">TEXT TO IMAGE GENERATOR</h1>
      <div className="flex flex-row gap-5 m-10">
        <input
          type="text"
          className="w-[40vw] h-10 rounded-full shadow-lg shadow-blue-700 px-3"
          placeholder="Enter text to generate image"
          value={genetext}
          onChange={(e) => setGenetext(e.target.value)}
        />
        <button
        type="submit"
          className="px-5 py-2 font-bold bg-green-700 rounded-full gene hover:shadow-xl hover:shadow-green-700"
          onClick={() => generateing(genetext)}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {loading && (
        <div className="mt-10">
          <div className="w-32 h-32 border-t-4 border-green-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Generating image, please wait...</p>
          <p className="mt-4 text-center text-white">It may take minute</p>
        </div>
      )}
      {imageUrl && (
        <div  className="relative overflow-hidden h-72 w-72">
          <img src={imageUrl} alt="" className="absolute top-0 w-full h-full z-1 rounded-2xl "/>
          <div className="absolute bottom-0 z-10 flex justify-end w-full p-2" >
          
            <button
            onClick={handledownload}>
              <Download size={32} className="p-1 bg-gray-700 rounded-md text-zinc-950 "/>
            </button>
          </div>
      </div>
      )}
      {sorrytext && (
        <div className="w-full text-center text-white ">
          <h1 className="text-3xl font-bold text-center text-green-800">SORRY</h1>
          <p className="text-2xl text-center text-white"> Image can't be generated</p>
          <p className="text-2xl text-center text-white">Please try again after some time</p>
        </div>
      )}
    </div>
  );
}


function App(){
  return (    
  <Router>
    <Routes>
      <Route path="/" element={<Image/>}/>
      
    </Routes>
  </Router>
  )
}


export default App;
