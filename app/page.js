'use client';
import { useState, useEffect } from 'react';

const AFFILIATE_BOOKS = [
  {
    title: '政治の教室',
    description: '政治の仕組みをわかりやすく解説',
    url: 'https://www.amazon.co.jp/',
    image: '📚',
  },
  {
    title: '選挙に行こう！',
    description: '民主主義の基礎から学べる入門書',
    url: 'https://www.amazon.co.jp/',
    image: '🗳️',
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MikoQuiz() {
  const [screen, setScreen] = useState('start');
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch('/questions.json')
      .then(r => r.json())
      .then(data => setAllQuestions(data))
      .catch(() => console.log('問題データを読み込めませんでした'));
  }, []);

  function startWithDifficulty(diff) {
    const pool = allQuestions.filter(q => q.difficulty === diff);
    const selected = shuffle(pool).slice(0, 8);
    setDifficulty(diff);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setScreen('question');
  }

  function handleAnswer(idx) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === questions[currentIndex].answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => setScreen('explanation'), 300);
  }

  function nextQuestion() {
    if (currentIndex + 1 >= questions.length) {
      setScreen('result');
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setScreen('question');
    }
  }

  function restart() {
    setScreen('start');
    setDifficulty(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  }

  const q = questions[currentIndex];
  const isCorrect = selectedAnswer === q?.answer;

  function getMikoResult() {
    if (score === 8) return { image: '/miko-shocked.png', text: 'え、全問正解！？\n本当に！？すごすぎます！' };
    if (score >= 6) return { image: '/miko-happy.png', text: 'すごい！政治に詳しいですね🌸' };
    if (score >= 4) return { image: '/miko-normal.png', text: 'まあまあですね。\nもう少し頑張りましょう' };
    if (score >= 1) return { image: '/miko-awkward.png', text: 'まだまだこれから！\n一緒に勉強しましょう' };
    return { image: '/miko-sad.png', text: 'これは悔しい…\nもう一回挑戦して！' };
  }

  const S = {
    pageWrap: { background: '#1e3a1e', minHeight: '100vh', width: '100%' },
    main: { fontFamily: "'Noto Serif JP', 'Georgia', serif", background: '#1e3a1e', minHeight: '100vh', color: '#f0f0e8', maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' },
    noise: { position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)', pointerEvents: 'none' },
    wrap: { position: 'relative', zIndex: 1, padding: '2.5rem 1.5rem 3rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    logo: { fontSize: 11, color: '#FF6B9D', letterSpacing: '0.25em', marginBottom: 8 },
    h1: { fontFamily: "'Noto Serif JP', serif", fontSize: 34, color: '#f8f8f0', textShadow: '1px 2px 6px rgba(0,0,0,0.5)', lineHeight: 1.3, marginBottom: 8 },
    mikoLg: { width: 160, height: 160, objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))', margin: '16px auto', display: 'block' },
    mikoSm: { width: 130, height: 130, objectFit: 'contain', flexShrink: 0 },
    btn: (bg = '#FF6B9D', fg = '#fff') => ({ background: bg, color: fg, border: 'none', borderRadius: 8, padding: '14px 20px', fontSize: 15, fontWeight: 'bold', cursor: 'pointer', width: '100%', fontFamily: "'Noto Serif JP', serif", letterSpacing: '0.05em', boxShadow: '0 4px 14px rgba(0,0,0,0.35)', transition: 'opacity 0.15s' }),
    progress: { height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
    progressFill: (pct) => ({ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#FF6B9D,#FFB3D1)', borderRadius: 2, transition: 'width 0.4s' }),
    choice: (idx, sel, ans, answered) => {
      let bg = 'rgba(255,255,255,0.06)', border = '1px solid rgba(255,255,255,0.12)', color = '#f0f0e8';
      if (answered) {
        if (idx === ans) { bg = 'rgba(80,180,80,0.18)'; border = '1px solid #64c864'; color = '#90ee90'; }
        else if (idx === sel) { bg = 'rgba(200,60,60,0.18)'; border = '1px solid #dc5050'; color = '#ff9090'; }
      }
      return { background: bg, border, borderRadius: 8, padding: '12px 14px', color, fontSize: 14, cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontFamily: "'Noto Serif JP', serif", transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10, width: '100%' };
    },
    bubble: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,107,157,0.25)', borderRadius: 10, padding: '12px 14px', fontSize: 13, lineHeight: 1.85, color: '#e0e0d8' },
    tag: { fontSize: 11, color: '#FFB3D1', letterSpacing: '0.1em', marginBottom: 10 },
  };

  return (
    <div style={S.pageWrap}><main style={S.main}>
      <div style={S.noise} />

      {screen === 'start' && (
        <div style={{ ...S.wrap, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <p style={S.logo}>🌸 MIKO SEIJI JUKU 🌸</p>
          <h1 style={S.h1}>先生みこの<br />政治塾</h1>
          <p style={{ color: '#9a9a88', fontSize: 13, lineHeight: 1.9, marginBottom: 4 }}>
            政治を楽しく学べる<br />4択クイズゲーム
          </p>
          <img src="/miko-pointing.png" alt="先生みこ" style={S.mikoLg} onError={e => e.target.style.display = 'none'} />
          <div style={{ width: '100%' }}>
            <button onClick={() => setScreen('difficulty')} style={S.btn()}>🌸 はじめる</button>
          </div>
          <p style={{ marginTop: 12, fontSize: 11, color: '#7a7a68' }}>無料・登録不要 · 全8問</p>
        </div>
      )}

      {screen === 'difficulty' && (
        <div style={{ ...S.wrap, justifyContent: 'center' }}>
          <p style={S.logo}>難易度を選んでください</p>
          <h2 style={{ ...S.h1, fontSize: 26, marginBottom: 28 }}>どのレベルに<br />挑戦しますか？</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '🌱 初級', diff: '初級', desc: '選挙の仕組み・基本的な政治用語', color: '#3a7a3a' },
              { label: '🔥 中級', diff: '中級', desc: '税金・財政・国会の仕組み', color: '#8a5a10' },
              { label: '⚡ 上級', diff: '上級', desc: '外交・安保・時事ニュース', color: '#8a1a1a' },
            ].map(({ label, diff, desc, color }) => (
              <button key={diff} onClick={() => startWithDifficulty(diff)}
                style={{ ...S.btn(color), textAlign: 'left', padding: '16px 18px' }}>
                <div style={{ fontSize: 17, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 'normal' }}>{desc}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setScreen('start')} style={{ ...S.btn('transparent', '#888'), marginTop: 16, border: '1px solid #3a3a2a' }}>← 戻る</button>
        </div>
      )}

      {screen === 'question' && q && (
        <div style={S.wrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#FF6B9D', letterSpacing: '0.15em' }}>{difficulty} · {currentIndex + 1}/{questions.length}</span>
            <span style={{ fontSize: 12, color: '#9a9a88' }}>✅ {score}問正解</span>
          </div>
          <div style={S.progress}><div style={S.progressFill(((currentIndex + 1) / questions.length) * 100)} /></div>

          <div style={S.tag}>📌 {q.category}</div>
          <div style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>{q.question}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {q.choices.map((choice, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)} style={S.choice(idx, selectedAnswer, q.answer, selectedAnswer !== null)}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'explanation' && q && (
        <div style={S.wrap}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 52 }}>{isCorrect ? '⭕️' : '❌'}</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: isCorrect ? '#90ee90' : '#ff9090', marginTop: 4 }}>
              {isCorrect ? '正解！' : '不正解…'}
            </div>
            {!isCorrect && <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>正解：{q.choices[q.answer]}</div>}
          </div>

          <div style={{ ...S.bubble, marginBottom: 14 }}>
            <div style={S.tag}>📖 解説</div>
            {q.explanation}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 24 }}>
            <div style={{ ...S.bubble, flex: 1, borderColor: 'rgba(255,179,209,0.35)', background: 'rgba(255,107,157,0.07)' }}>
              <div style={{ ...S.tag, color: '#FFB3D1' }}>💬 みこの一言</div>
              {q.miko_comment}
            </div>
            <img
              src={q.illustration === 'pointing' ? '/miko-pointing.png' : '/miko-thinking.png'}
              alt="先生みこ" style={S.mikoSm}
              onError={e => e.target.style.display = 'none'}
            />
          </div>

          <button onClick={nextQuestion} style={S.btn()}>
            {currentIndex + 1 >= questions.length ? '結果を見る 🌸' : '次の問題へ →'}
          </button>
        </div>
      )}

      {screen === 'result' && (() => {
        const { emoji, text } = getMikoResult();
        return (
          <div style={S.wrap}>
            <p style={S.logo}>🌸 RESULT 🌸</p>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 56 }}>{emoji}</div>
              <div style={{ fontSize: 52, fontWeight: 'bold', color: '#FF6B9D', lineHeight: 1 }}>
                {score}<span style={{ fontSize: 20, color: '#888' }}> / 8問</span>
              </div>
              <div style={{ fontSize: 14, color: '#FFB3D1', marginTop: 10, lineHeight: 1.9, whiteSpace: 'pre-line' }}>{text}</div>
            </div>

            <img src={getMikoResult().image} alt="先生みこ"
              style={{ ...S.mikoLg, width: 130, height: 130, marginBottom: 20 }}
              onError={e => e.target.style.display = 'none'} />

            <button onClick={() => {
              const t = `先生みこの政治塾で${score}/8問正解しました！🌸\nあなたも政治クイズに挑戦してみて！\nhttps://miko-quiz.vercel.app\n#真白みこ`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`, '_blank');
            }} style={{ ...S.btn('#000', '#fff'), marginBottom: 10 }}>𝕏 結果をシェアする</button>

            <button onClick={restart} style={{ ...S.btn('transparent', '#888'), border: '1px solid #3a3a2a' }}>↩ もう一度挑戦する</button>
          </div>
        );
      })()}
    </main></div>
  );
}