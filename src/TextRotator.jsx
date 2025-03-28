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

    let delay = 20;
    let elapsedTime = 0;
    const duration = 7000; // Tempo total de execução
    
    const randomizer = () => {
        
        if (elapsedTime >= duration) {
            // Parar e definir o vencedor final
            setIsRunning(false);
            const finalText = extractedNames[Math.floor(Math.random() * extractedNames.length)];
            setCurrentText(finalText);
            winner = finalText;
            delay = 20; 
            elapsedTime = 0;
            return;
        }
    
        // Atualiza o texto com um nome aleatório
        setCurrentText(extractedNames[Math.floor(Math.random() * extractedNames.length)]);
    
        // Ajusta o delay para criar o efeito de desaceleração
        delay *= 1.016; // Aumenta o tempo entre atualizações
        elapsedTime += delay;
    
        // Chama a função novamente após o novo delay
        setTimeout(randomizer, delay);
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