"use client";
import React, { useState, useEffect, useRef } from "react";

const Game = () => {
  const boxCount = 50; // Jumlah kotak dalam satu baris/kolom
  const containerSize = 600; // Ukuran kontainer
  const boxSize = containerSize / boxCount; // Ukuran setiap kotak
  const [gameId, setGameId] = useState();
  const speed = 200;

  const layoutRef = useRef(
    Array.from({ length: boxCount }, () => Array(boxCount).fill(0))
  ); // Gunakan useRef untuk menyimpan layout

  useEffect(() => {
    return () => {
      if (gameId) {
        clearInterval(gameId);
      }
    };
  }, [gameId]);

  const [layout, setLayout] = useState(layoutRef.current); // State layout

  const [isMouseDown, setIsMouseDown] = useState(false); // State untuk melacak apakah mouse ditekan

  const updateLayout = (indexLayout, indexFloor) => {
    const newLayout = layout.map((row) => [...row]); // Salin layout saat ini
    // Toggle nilai
    newLayout[indexLayout][indexFloor] =
      newLayout[indexLayout][indexFloor] === 0 ? 1 : 0;
    setLayout(newLayout);
    layoutRef.current = newLayout; // Update useRef dengan layout baru
  };

  const checkNeighbor = (indexLayout, indexFloor) => {
    const x = indexLayout;
    const y = indexFloor;
    let neighborCount = 0;
    const neighbor = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];
    neighbor.forEach((item) => {
      if (checkIsAlive(item[0], item[1])) {
        neighborCount++;
      }
    });
    return neighborCount;
  };

  const checkIsAlive = (x, y) => {
    if (x < 0 || x >= boxCount || y < 0 || y >= boxCount) {
      return 0;
    }
    return layoutRef.current[x][y];
  };

  const playGame = () => {
    if (!gameId) {
      const intervalId = setInterval(() => {
        // Buat salinan dari layout untuk memperbarui
        setLayout((prevLayout) => {
          const newLayout = prevLayout.map((row) => [...row]); // Salin layout

          for (let x = 0; x < boxCount; x++) {
            for (let y = 0; y < boxCount; y++) {
              const countAlive = checkNeighbor(x, y); // Hitung jumlah tetangga yang hidup

              // Aturan permainan
              if (prevLayout[x][y] === 0 && countAlive === 3) {
                newLayout[x][y] = 1; // Ubah menjadi hidup
              } else if (
                prevLayout[x][y] === 1 &&
                (countAlive < 2 || countAlive > 3)
              ) {
                newLayout[x][y] = 0; // Ubah menjadi mati
              }
            }
          }

          layoutRef.current = newLayout; // Update useRef dengan layout baru
          return newLayout; // Kembalikan layout yang diperbarui
        });
      }, speed); // Waktu interval bisa disesuaikan sesuai kebutuhan

      // Set ID interval
      setGameId(intervalId);
    }
  };

  const clearGame = () => {
    if (gameId) {
      clearInterval(gameId);
    }
    setGameId(null);
    // layoutRef.current = Array.from({ length: boxCount }, () =>
    //   Array(boxCount).fill(0)
    // ); // Reset layout
    // setLayout(layoutRef.current); // Reset state layout
  };

  const handleMouseEnter = (indexLayout, indexFloor) => {
    if (isMouseDown) {
      updateLayout(indexLayout, indexFloor); // Update layout saat mouse drag
    }
  };

  return (
    <div
      className="flex justify-center flex-col space-y-6 items-center bg-amber-500 text-white h-screen w-full"
      onMouseUp={() => setIsMouseDown(false)} // Reset saat mouse up
    >
      <div className="space-x-4">
        <button
          className="py-2 px-6 hover:bg-blue-700 bg-blue-600 rounded-md"
          onClick={() => {
            playGame();
          }}
        >
          play
        </button>
        <button
          onClick={() => {
            clearGame();
          }}
          className="py-2 px-6 hover:bg-blue-700 bg-blue-600 rounded-md"
        >
          Clear
        </button>
      </div>
      <div
        className="aspect-square bg-blue-500"
        onMouseLeave={() => setIsMouseDown(false)} // Reset saat mouse keluar dari area
      >
        {layout.map((floor, indexLayout) => (
          <div className="flex" key={indexLayout}>
            {floor.map((square, indexFloor) => (
              <div
                onMouseDown={() => {
                  setIsMouseDown(true);
                  updateLayout(indexLayout, indexFloor); // Update layout saat mouse down
                }}
                onMouseEnter={() => handleMouseEnter(indexLayout, indexFloor)} // Update saat drag
                key={indexLayout + "-" + indexFloor}
                className={`${
                  layout[indexLayout][indexFloor] === 0
                    ? "bg-white"
                    : "bg-blue-300"
                } border border-black/30 cursor-pointer`}
                style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
