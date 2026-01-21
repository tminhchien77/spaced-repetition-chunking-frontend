import { useEffect, useState } from "react"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function groupChunks(rows) {
  const map = {}

  rows.forEach(r => {
    if (!map[r.chunk_id]) {
      map[r.chunk_id] = {
        chunk_id: r.chunk_id,
        chunk: r.chunk,
        frequency: r.frequency,
        items: []
      }
    }

    map[r.chunk_id].items.push({
      keyword: r.keyword,
      syntagmid: r.syntagmid,
      syntagm_name: r.syntagm_name,
      target_part_of_speech: r.target_part_of_speech
    })
  })

  return Object.values(map)
}

export default function App() {
  const [chunks, setChunks] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const userId = 1

  useEffect(() => {
    const params = new URLSearchParams({
      user_id: 1,
      limit: 50
    })
    fetch(`${API_BASE_URL}/chunks?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setChunks(groupChunks(data))
        setIndex(0)
      })
  }, [])

  if (!chunks.length) {
    return <div className="mt-20 text-center text-slate-500">Loading...</div>
  }

  const current = chunks[index]
  const encoded = encodeURIComponent(current.chunk)

  const submitQuality = async (q) => {
    setLoading(true)
    await fetch(`${API_BASE_URL}/chunks/${current.chunk_id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quality: q
      })
    })
    setIndex(i => i + 1)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-lg p-6 space-y-6">

        {/* Chunk */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {current.chunk}
          </h1>
          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-slate-200 text-slate-600">
            Frequency: {current.frequency}
          </span>
        </div>

        {/* YouGlish */}
        <div className="flex flex-col items-center gap-4 py-6 border rounded-xl bg-slate-50">
          <div className="text-slate-600 text-sm text-center">
            Hear <span className="font-medium text-slate-800">
              “{current.chunkphrase}”
            </span> in real-life videos
          </div>

          <a
            href={`https://youglish.com/pronounce/${encoded}/english`}
            target="_blank"
            rel="noopener noreferrer"
            className="
      px-8 py-3 rounded-2xl
      bg-indigo-600 text-white
      font-semibold
      text-lg
      hover:bg-indigo-700
      transition
      shadow
    "
          >
            🎧 Open on YouGlish
          </a>

          <div className="text-xs text-slate-400">
            (Opens in a new tab)
          </div>
        </div>

        {/* Keywords & Grammar */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-2">
            Keywords & Grammar
          </h3>

          <div className="grid gap-2">
            {current.items.map((it, i) => (
              <div
                key={i}
                className="flex flex-wrap gap-2 items-center bg-slate-50 border rounded-lg px-3 py-2"
              >
                <span className="font-medium text-slate-800">
                  {it.keyword}
                </span>

                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  {it.syntagm_name} ({it.syntagmid})
                </span>

                <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  {it.target_part_of_speech}
                </span>

              </div>
            ))}
          </div>
        </div>

        {/* Quality */}
        {/* <div className="grid grid-cols-3 gap-3 pt-2">
          {[0, 1, 2, 3, 4, 5].map(q => (
            <button
              key={q}
              disabled={loading}
              onClick={() => submitQuality(q)}
              className="py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Quality {q}
            </button>
          ))}
        </div> */}
        {/* Quality buttons */}
        <div className="space-y-2">
          <p className="text-center text-slate-600 text-sm">
            How well did you remember this?
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { q: 0, label: "😵 Blackout", color: "bg-red-500" },
              { q: 1, label: "❌ Wrong", color: "bg-red-400" },
              { q: 2, label: "😐 Hard", color: "bg-orange-400" },
              { q: 3, label: "🙂 OK", color: "bg-yellow-400" },
              { q: 4, label: "😄 Good", color: "bg-green-500" },
              { q: 5, label: "🤩 Easy", color: "bg-emerald-600" }
            ].map(btn => (
              <button
                key={btn.q}
                disabled={loading}
                onClick={() => submitQuality(btn.q)}
                className={`
                  ${btn.color}
                  text-white
                  py-3 rounded-xl
                  font-medium
                  hover:opacity-90
                  disabled:opacity-50
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-slate-400">
          {index + 1} / {chunks.length}
        </div>
      </div>
    </div>
  )
}
