import { useEffect, useState } from "react"

export default function App() {
    const [chunks, setChunks] = useState([])
    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const userId = 1

    useEffect(() => {
        const params = new URLSearchParams({
            user_id: 1,
            limit: 10
        })

        fetch(`http://localhost:8000/chunks?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setChunks(data)
                setIndex(0)
            })
    }, [])

    if (!chunks.length) {
        return <div className="text-center mt-20 text-slate-500">Loading...</div>
    }

    const current = chunks[index]
    const encoded = encodeURIComponent(current.chunk)

    const submitQuality = async (q) => {
        setLoading(true)

        try {
            await fetch(`http://localhost:8000/chunks/${current.chunk_id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    chunk_id: current.chunk_id,
                    quality: q
                })
            })

            // sang từ tiếp theo
            setIndex(i => i + 1)
        } catch (err) {
            console.error(err)
            alert("Submit failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 space-y-6">

                {/* Phrase */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        {current.chunk}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Frequency: {current.frequency}
                    </p>
                </div>

                {/* YouGlish */}
                <div className="rounded-xl overflow-hidden border">
                    <iframe
                        key={current.chunk}
                        src={`https://youglish.com/pronounce/${encoded}/english`}
                        className="w-full h-[360px]"
                        allow="autoplay"
                    />
                </div>

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

                {/* Progress */}
                <div className="text-center text-slate-400 text-sm">
                    {index + 1} / {chunks.length}
                </div>

            </div>
        </div>
    )
}















import { useEffect, useState } from "react"

export default function App() {
    const [chunks, setChunks] = useState([])
    const [index, setIndex] = useState(0)

    // 👉 mock trước, sau này thay fetch API
    useEffect(() => {
        const params = new URLSearchParams({
            user_id: 1,
            limit: 10
        })
        console.log(`http://localhost:8000/chunks?${params.toString()}`)
        fetch(`http://localhost:8000/chunks?${params.toString()}`)
            .then(res => res.json())
            .then(setChunks)
    }, [])

    if (!chunks.length) {
        return <div className="text-center mt-20">Loading...</div>
    }

    const current = chunks[index]
    const encoded = encodeURIComponent(current.chunkphrase)

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 space-y-6">

                {/* Phrase */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        {current.chunk}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Frequency: {current.frequency}
                    </p>
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

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <div className="text-slate-400">
                        {index + 1} / {chunks.length}
                    </div>

                    <button
                        onClick={() => setIndex(i => i + 1)}
                        disabled={index === chunks.length - 1}
                        className="
              px-6 py-2 rounded-xl
              bg-indigo-600 text-white
              font-medium
              hover:bg-indigo-700
              disabled:bg-slate-300
              disabled:cursor-not-allowed
            "
                    >
                        Next →
                    </button>
                </div>

            </div>
        </div>
    )
}
