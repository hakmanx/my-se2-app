"use client";

import React from "react";
import { useState, useMemo } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [uri, setUri] = useState("http://localhost:3000/nft-demo.png");

  // читаем цену минта и статус паузы
  const { data: mintPriceWei } = useScaffoldReadContract({
    contractName: "MyNFT",
    functionName: "mintPrice",
  });

  const { data: mintPaused } = useScaffoldReadContract({
    contractName: "MyNFT",
    functionName: "mintPaused",
  });

  const mintPriceEth = useMemo(
    () => (mintPriceWei ? formatEther(mintPriceWei as bigint) : "0"),
    [mintPriceWei]
  );

  // запись в контракт
  const { writeContractAsync, isPending } = useScaffoldWriteContract("MyNFT");

  const onMint = async () => {
    if (!uri) return;
    // отправляем ровно mintPrice из контракта
    const value = (mintPriceWei as bigint) ?? parseEther("0.01");
    await writeContractAsync({
      functionName: "mint",
      args: [uri],
      value,
    });
  };

  const onPause = async (p: boolean) => {
    await writeContractAsync({
      functionName: "pauseMint",
      args: [p],
    });
  };

  const onSetPrice = async (ethStr: string) => {
    // быстрый setters (не обязательно, но удобно)
    const wei = parseEther(ethStr);
    await writeContractAsync({
      functionName: "setMintPrice",
      args: [wei],
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <span>🎨</span> MyNFT Showcase
      </h1>

      <div className="w-full max-w-2xl grid gap-6">
        {/* CARD: Mint */}
        <div className="rounded-2xl shadow p-5 bg-white/70">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Mint NFT</h2>
            <div className="text-sm opacity-80">
              Price: <b>{mintPriceEth}</b> ETH {mintPaused ? <span className="text-red-600">• paused</span> : null}
            </div>
          </div>

          <label className="text-sm block mb-1">Token URI</label>
          <input
            className="w-full rounded-xl border px-3 py-2 mb-4"
            placeholder="http://localhost:3000/nft-demo.png  или  ipfs://demo"
            value={uri}
            onChange={e => setUri(e.target.value)}
          />

          <button
            onClick={onMint}
            disabled={!isConnected || isPending || !!mintPaused}
            className="rounded-xl px-4 py-2 bg-black text-white disabled:opacity-50"
          >
            {isPending ? "Minting..." : "Mint"}
          </button>

          {!isConnected && <div className="mt-2 text-sm text-orange-600">Подключи кошелёк (Hardhat 31337)</div>}
          {!!mintPaused && <div className="mt-2 text-sm text-red-600">Минт на паузе</div>}
        </div>

        {/* CARD: Pause / Unpause / Set Price */}
        <div className="rounded-2xl shadow p-5 bg-white/70">
          <h2 className="text-xl font-semibold mb-3">Admin</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onPause(true)}
              className="rounded-xl px-4 py-2 bg-red-600 text-white"
            >
              Pause
            </button>
            <button
              onClick={() => onPause(false)}
              className="rounded-xl px-4 py-2 bg-emerald-600 text-white"
            >
              Unpause
            </button>

            <button
              onClick={() => onSetPrice("0.01")}
              className="rounded-xl px-4 py-2 bg-slate-800 text-white"
            >
              Set price = 0.01 ETH
            </button>
          </div>

          <p className="mt-3 text-sm opacity-80">
            Эти кнопки требуют прав владельца контракта (твой первый hardhat-аккаунт, который деплоил контракт).
          </p>
        </div>

        {/* CARD: Пример карточки токена #1 */}
        <div className="rounded-2xl shadow p-5 bg-white/70">
          <h2 className="text-xl font-semibold mb-3">Token #1</h2>
          <p className="text-sm opacity-80 mb-3">Пример отображения карточки (если #1 существует).</p>
          {/* Упрощённый показ — как было раньше: if ipfs:// — заменяем на публичный шлюз */}
          {/* В реальном приложении подтягивай URI из события Transfer или из оффчейн-списка */}
          <div className="rounded-xl border p-4">
            <img
              src={"/nft-demo.png"}
              alt="NFT Image"
              className="rounded-lg w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <footer className="opacity-60 text-sm mt-8">
        {isConnected ? `Connected: ${address}` : "Wallet not connected"}
      </footer>
    </main>
  );
}
