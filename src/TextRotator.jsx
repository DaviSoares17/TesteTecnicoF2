import React, { useState, useEffect } from 'react';
import './TextRotator.css';
import * as XLSX from 'xlsx';

const TextRotator = () => {
     
    let extractedNames;
    let winner;
    const [currentText, setCurrentText] = useState('');
    const [isRunning, setIsRunning] = useState(false); 
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const handleKeyPress = (e) => {
        if (e.key === ' ') {
            
            startRotating();
        }
        if (e.key === 'l') {
            clearName();
        }
        
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
        window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const clearName = () => {
        extractedNames = extractedNames.filter(item => item !== winner);
        setCurrentText("");
    }

    const randomizer = () => {
        if (isRunning) return;

            setIsRunning(true);


            const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * extractedNames.length);
            setCurrentText(extractedNames[randomIndex]);
            }, 100);


            const timeout = setTimeout(() => {
            clearInterval(interval);
            setIsRunning(false);
            const finalText = extractedNames[Math.floor(Math.random() * extractedNames.length)];
            setCurrentText(finalText);
            winner = finalText;
            }, 5000);

            setIntervalId(interval); 
    }

    const startRotating = () => {
        if(extractedNames === undefined){
            fetch("/nomes.xlsx")
            .then((response) => response.arrayBuffer())
            .then((data) => {
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                extractedNames = jsonData.map((row) => row[0]).filter(Boolean);
                randomizer();
                
            })
            .catch((error) => console.error("Error loading Excel file:", error));

        }else{
            randomizer();
        }
        
        
  };

  return (
    <div className="rotator-container">
      <div className="rotator-text">{currentText}</div>
      
    </div>
  );
};

export default TextRotator;