"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';


const RSS_SOURCES = [
  { name: 'Cointelegraph', url: 'https://corsproxy.io/?https://cointelegraph.com/rss' },
  { name: 'CoinDesk', url: 'https://corsproxy.io/?https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { name: 'Decrypt', url: 'https://corsproxy.io/?https://decrypt.co/feed' },
  { name: 'CryptoSlate', url: 'https://corsproxy.io/?https://cryptoslate.com/feed/' },
  { name: 'Bitcoin Magazine', url: 'https://corsproxy.io/?https://bitcoinmagazine.com/.rss/full/' },
  { name: 'CryptoPotato', url: 'https://corsproxy.io/?https://cryptopotato.com/feed/' },
  { name: 'NewsBTC', url: 'https://corsproxy.io/?https://www.newsbtc.com/feed/' },
  { name: 'Bitcoinist', url: 'https://corsproxy.io/?https://bitcoinist.com/feed/' },
  { name: 'The Block', url: 'https://corsproxy.io/?https://www.theblockcrypto.com/rss.xml' },
  { name: 'Crypto News', url: 'https://corsproxy.io/?https://cryptonews.com/news/feed/' },
  { name: 'CoinFunda', url: 'https://corsproxy.io/?https://coinfunda.com/feed' },
  { name: 'Coingape', url: 'https://corsproxy.io/?https://coingape.com/feed' },
  { name: 'WazirX Blog', url: 'https://corsproxy.io/?https://wazirx.com/blog/feed' },
  { name: 'BeInCrypto', url: 'https://corsproxy.io/?https://beincrypto.com/feed/' },
  { name: 'Chainlink Blog', url: 'https://corsproxy.io/?https://blog.chain.link/rss/' },
  { name: 'Web3 Daily', url: 'https://corsproxy.io/?https://web3daily.substack.com/feed' },
];

function parseRSS(xml) {
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item')).map(item => {
    // Try to get image from media:content or enclosure
    let image = null;
    const media = item.querySelector('media\\:content, content');
    if (media && media.getAttribute('url')) {
      image = media.getAttribute('url');
    } else {
      const enclosure = item.querySelector('enclosure');
      if (enclosure && enclosure.getAttribute('url')) {
        image = enclosure.getAttribute('url');
      }
    }
    return {
      title: item.querySelector('title')?.textContent,
      link: item.querySelector('link')?.textContent,
      pubDate: item.querySelector('pubDate')?.textContent,
      source: 'CoinDesk',
      image,
    };
  });
  return items;
}


export default function News() {
  const [tab, setTab] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(RSS_SOURCES[tab].url)
      .then(res => res.text())
      .then(xml => {
        const parsed = parseRSS(xml).map(a => ({ ...a, source: RSS_SOURCES[tab].name }));
        setArticles(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load news feed');
        setLoading(false);
      });
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Crypto News</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {RSS_SOURCES.map((src, i) => (
            <button
              key={src.name}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border border-gray-700/60 focus:outline-none ${
                tab === i ? 'bg-blue-600 text-white shadow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={{ flex: '1 0 160px', minWidth: 120, maxWidth: 220 }}
            >
              {src.name}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="p-4 text-gray-400">Loading news...</div>
        ) : error ? (
          <div className="p-4 text-red-400">{error}</div>
        ) : (
          <ul className="space-y-6">
            {articles.map((a, i) => (
              <li key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700/50 flex flex-col items-center">
                {a.image && (
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="block w-full mb-3">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-full max-h-72 object-cover rounded-lg border border-gray-700/40 shadow-lg"
                      style={{ background: '#222' }}
                    />
                  </a>
                )}
                <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-blue-400 hover:underline text-center block">
                  {a.title}
                </a>
                <div className="text-xs text-gray-400 mt-2 flex justify-between w-full">
                  <span>{a.source}</span>
                  <span>{a.pubDate && new Date(a.pubDate).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
