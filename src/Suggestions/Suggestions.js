import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";

const Suggestions = () => {
  const [keywords, setKeywords] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [patternArray, setPatternArray] = useState([]);

  function generateStrings() {
    let result = [];

    // add single-letter strings
    for (let i = 97; i <= 122; i++) {
      // loop through ASCII codes for lowercase a to z
      result.push(String.fromCharCode(i));
    }

    // add two-letter strings
    for (let i = 97; i <= 122; i++) {
      // loop through ASCII codes for lowercase a to z
      let char1 = String.fromCharCode(i);

      for (let j = 97; j <= 122; j++) {
        // nested loop for second character
        let char2 = String.fromCharCode(j);
        result.push(char1 + char2);
      }
    }

    // add three-letter strings
    for (let i = 97; i <= 122; i++) {
      // loop through ASCII codes for lowercase a to z
      let char1 = String.fromCharCode(i);

      for (let j = 97; j <= 122; j++) {
        // nested loop for second character
        let char2 = String.fromCharCode(j);

        for (let k = 97; k <= 122; k++) {
          // nested loop for third character
          let char3 = String.fromCharCode(k);
          result.push(char1 + char2 + char3);
        }
      }
    }

    return result;
  }

  useEffect(() => {
    const patternArray = generateStrings();
    setPatternArray(patternArray);
  }, []);

  const fetchKeywords = async () => {
    let count = 0;
    let counter = 0;
    let variants = [query];
    let keywordsSet = new Set();
    setIsLoading(true);

    while (count < 100 && variants.length > 0) {
      const currentVariant = variants.shift();
      const url = `https://trueimperium.com:443/https://suggestqueries.google.com/complete/search?client=chrome&q=${currentVariant}`;
      const response = await fetch(url);
      const data = await response.json();
      const keywordsArr = data[1].filter(
        (keyword) => !keywordsSet.has(keyword)
      );
      keywordsSet = new Set([...keywordsSet, ...keywordsArr]);
      setKeywords((prevKeywords) => {
        return [
          ...prevKeywords,
          ...keywordsArr.map((keyword, index) => ({
            id: count + index,
            keyword,
          })),
        ];
      });
      variants = [`${query} ${patternArray[counter]}`];
      count += keywordsArr.length;
      counter += 1;
      setProgress(Math.floor((count / 100) * 100));
    }

    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleButtonClick = () => {
    setKeywords([]);
    setProgress(0);
    fetchKeywords();
  };

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <TextField
          variant="outlined"
          label="Query"
          value={query}
          onChange={handleInputChange}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          Find Keywords
        </Button>
      </div>
      {isLoading && <LinearProgress variant="determinate" value={progress} />}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Keyword</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keywords.map((keyword, index) => {
              if (index < 100) {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ maxWidth: "0px" }}>
                      {keyword.keyword}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Suggestions;
