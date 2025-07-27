import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ANIMALS = {
  stompy: {
    name: 'Stompy the Goat',
    species: 'Goat',
    sanctuary: 'Alveus Sanctuary',
    joined: 'August 2023',
    about: "Hi I'm Stompy and I'm an ostrich blah blah I was found in blah blah blah. My favorite food is blah blah bugs.",
    coverImg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 815, goal: 2000 },
    gallery: [
      'https://placehold.co/150x100?text=1',
      'https://placehold.co/150x100?text=2',
      'https://placehold.co/150x100?text=3',
    ],
    comments: [
      { user: 'Clara', text: 'Stunned by Stompy\'s beauty! ♥' },
      { user: 'James', text: '👑 1 ♥' },
      { user: 'Emily', text: 'You go, Stomp!' },
    ],
    supporters: [
      { name: 'Pawfect Coffee Co.', amount: 2000 },
      { name: 'Linda S.', amount: 1500 },
      { name: 'CryptoCat DAO', amount: 1250 },
    ],
  },
  luna: {
    name: 'Luna the Cow',
    species: 'Cow',
    sanctuary: 'Gentle Barn',
    joined: 'May 2022',
    about: "Luna loves sunbathing and making new friends. She was rescued from a dairy farm and now enjoys a peaceful life.",
    coverImg: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 1200, goal: 2500 },
    gallery: [
      'https://placehold.co/150x100?text=Luna1',
      'https://placehold.co/150x100?text=Luna2',
      'https://placehold.co/150x100?text=Luna3',
    ],
    comments: [
      { user: 'Sam', text: 'Luna is the sweetest!' },
      { user: 'Jess', text: 'So glad she\'s safe now.' },
    ],
    supporters: [
      { name: 'Happy Hooves', amount: 900 },
      { name: 'Moo Friends', amount: 700 },
    ],
  },
  bella: {
    name: 'Bella the Pig',
    species: 'Pig',
    sanctuary: 'Sunny Acres',
    joined: 'March 2021',
    about: "Bella is a playful pig who loves mud baths and belly rubs. She was rescued from a factory farm.",
    coverImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 600, goal: 1800 },
    gallery: [
      'https://placehold.co/150x100?text=Bella1',
      'https://placehold.co/150x100?text=Bella2',
      'https://placehold.co/150x100?text=Bella3',
    ],
    comments: [
      { user: 'Megan', text: 'Bella is adorable!' },
    ],
    supporters: [
      { name: 'Piggy Pals', amount: 400 },
    ],
  },
  max: {
    name: 'Max the Horse',
    species: 'Horse',
    sanctuary: 'Freedom Reins',
    joined: 'January 2020',
    about: "Max is a gentle giant who loves apples and running in open fields. He was rescued from neglect.",
    coverImg: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1200&h=250&fit=crop&crop=center',
    profileImg: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=100&h=100&fit=crop&crop=center',
    donation: { raised: 2000, goal: 3000 },
    gallery: [
      'https://placehold.co/150x100?text=Max1',
      'https://placehold.co/150x100?text=Max2',
      'https://placehold.co/150x100?text=Max3',
    ],
    comments: [
      { user: 'Alex', text: 'Max is so majestic!' },
    ],
    supporters: [
      { name: 'Horse Heroes', amount: 1500 },
    ],
  },
  // Add more sample animals here
};

export default function AmbassadorProfilePage() {
  const { id } = useParams();
  const animal = ANIMALS[id] || ANIMALS['stompy'];
  const [custom, setCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    updateTheme();
    window.addEventListener('themechange', updateTheme);
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('themechange', updateTheme);
      observer.disconnect();
    };
  }, []);

  // Add mock stats and timeline posts for desktop, inspired by mobile
  const animalStats = {
    age: animal.age || '3 years old',
    location: animal.location || 'Austin, Texas',
    rescueDate: animal.rescueDate || 'March 2022',
    followers: animal.followers || 1247,
    personality: animal.personality || ['Playful', 'Adventurous', 'Social'],
    needs: animal.needs || ['Special diet', 'Regular vet checkups', 'Enrichment toys'],
    feeling: animal.feeling || 'Silly',
    feelingEmoji: animal.feelingEmoji || '🤪',
    feelingUpdate: animal.feelingUpdate || '2 hours ago',
  };
  const timelinePosts = [
    {
      id: 1,
      date: '2 days ago',
      user: animal.name,
      avatar: animal.profileImg,
      content: 'Stompy got a new climbing structure! Thanks to your donations, Stompy now has a brand new climbing structure in his enclosure. He absolutely loves it!',
      image: animal.gallery[0],
      reactions: { like: 8, laugh: 2, love: 5, sad: 0 },
      comments: [
        { user: 'Clara', text: 'So happy for Stompy!' },
        { user: 'James', text: 'Goat parkour king!' }
      ]
    },
    {
      id: 2,
      date: '1 week ago',
      user: animal.name,
      avatar: animal.profileImg,
      content: 'Vet checkup went great! Stompy had his annual checkup and the vet says he\'s in perfect health. His hooves are looking great too!',
      image: null,
      reactions: { like: 12, laugh: 1, love: 7, sad: 0 },
      comments: [
        { user: 'Emily', text: 'Healthy and happy!' }
      ]
    }
  ];
  const [postReactions, setPostReactions] = useState(timelinePosts.map(post => ({ ...post.reactions })));
  const [postComments, setPostComments] = useState(timelinePosts.map(post => post.comments));
  const [commentInputs, setCommentInputs] = useState(timelinePosts.map(() => ''));

  const handleReact = (postIdx, type) => {
    setPostReactions(prev => prev.map((r, i) => i === postIdx ? { ...r, [type]: r[type] + 1 } : r));
  };
  const handleCommentInput = (postIdx, value) => {
    setCommentInputs(prev => prev.map((v, i) => i === postIdx ? value : v));
  };
  const handleAddComment = (postIdx) => {
    if (commentInputs[postIdx].trim()) {
      setPostComments(prev => prev.map((c, i) => i === postIdx ? [...c, { user: 'You', text: commentInputs[postIdx] }] : c));
      setCommentInputs(prev => prev.map((v, i) => i === postIdx ? '' : v));
    }
  };

  return (
    <div className="ambassador-profile" style={{ background: 'var(--background)' }}>
      {/* Cover and Profile Header */}
      <div className="profile-header" style={{ position: 'relative', height: 180, background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${animal.coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 24, marginBottom: 24 }}>
        {/* Avatar and name/species/sanctuary positioned together */}
        <div className="avatar-name" style={{ position: 'absolute', bottom: -60, left: 32, display: 'flex', alignItems: 'flex-end', gap: 24 }}>
          <img src={animal.profileImg} alt="Animal Avatar" style={{ border: '4px solid var(--background)', borderRadius: '50%', width: 100, height: 100, objectFit: 'cover' }} />
          <div style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ margin: 0, fontFamily: 'Calistoga, serif', color: '#fff', fontSize: 28 }}>{animal.name}</h1>
              <span style={{ color: '#fff', opacity: 0.7, fontSize: 16, fontWeight: 400, marginLeft: 4 }}>{animal.species} @ {animal.sanctuary}</span>
            </div>
          </div>
        </div>
        <div className="actions" style={{ position: 'absolute', top: 12, right: 24, display: 'flex', gap: 12 }}>
          <button className="button" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Donate
          </button>
          <button className="button" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Follow
          </button>
          <button className="button" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Share
          </button>
        </div>
      </div>

      {/* Fundraising Bar */}
      <div className="profile-stats" style={{ marginLeft: 176, marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--primary)' }}>${animal.donation.raised} raised</div>
          <div style={{ fontSize: 14, color: 'var(--text)', opacity: 0.7 }}>/ ${animal.donation.goal} goal</div>
          <div style={{ flex: 1 }}>
            <div style={{ width: '100%', height: 8, background: 'var(--gray)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((animal.donation.raised/animal.donation.goal)*100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>{Math.round((animal.donation.raised/animal.donation.goal)*100)}%</div>
        </div>
      </div>

      {/* Emotion Card */}
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card)', border: '2px solid var(--accent)', borderRadius: 16, padding: '16px 24px' }}>
          <span style={{ fontSize: 32 }}>{animalStats.feelingEmoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--primary)' }}>{animal.name} is feeling: {animalStats.feeling}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Updated {animalStats.feelingUpdate}</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="tab-content" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="about-card" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2>About {animal.name.split(' ')[0]}</h2>
            <p>{animal.about}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><strong>Age:</strong><br />{animalStats.age}</div>
              <div><strong>Location:</strong><br />{animalStats.location}</div>
              <div><strong>Rescued:</strong><br />{animalStats.rescueDate}</div>
              <div><strong>Followers:</strong><br />{animalStats.followers.toLocaleString()}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Personality:</strong>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {animalStats.personality.map(trait => (
                  <span key={trait} style={{ padding: '4px 8px', background: 'linear-gradient(90deg, var(--accent), var(--primary))', color: '#fff', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{trait}</span>
                ))}
              </div>
            </div>
            <div>
              <strong>Current Needs:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: 'var(--text)' }}>
                {animalStats.needs.map(need => (
                  <li key={need} style={{ marginBottom: 4 }}>{need}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="leaderboard" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2>Top Supporters 🏆</h2>
            <ol>
              {animal.supporters.map((s, i) => (
                <li key={i}><strong>{s.name}</strong> – ${s.amount.toLocaleString()}</li>
              ))}
            </ol>
          </div>
          <div className="gallery" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2>Photo Gallery</h2>
            <div className="photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
              {(animal.gallery.slice(0, 9)).map((img, i) => (
                <img key={i} src={img} alt={`${animal.name} ${i+1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />
              ))}
            </div>
            <a href="#" style={{ display: 'block', marginTop: 16, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', textAlign: 'right' }}>See all photos</a>
          </div>
          <div className="comments" style={{ background: 'var(--card)', borderRadius: 16, padding: 24 }}>
            <h2>Comments</h2>
            <div style={{ background: 'var(--background)', padding: 16, borderRadius: 12, marginTop: 12 }}>
              {animal.comments.map((c, i) => (
                <p key={i}><strong>{c.user}:</strong> {c.text}</p>
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'flex' }}>
              <input type="text" placeholder="Add a comment..." style={{ flex: 1, padding: '0.5rem', borderRadius: '6px 0 0 6px', border: '1.5px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
              <button className="button" style={{ borderRadius: '0 6px 6px 0', background: 'var(--pink)', color: '#fff' }}>Post</button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div>
          <div className="status" style={{ background: 'var(--card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2>Timeline & Updates</h2>
            {timelinePosts.map((post, idx) => (
              <div key={post.id} style={{ background: 'var(--background)', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <img src={post.avatar} alt={post.user} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{post.user}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.date}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 8, color: 'var(--text)' }}>{post.content}</div>
                {post.image && <img src={post.image} alt="Post" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                  <button onClick={() => handleReact(idx, 'like')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>👍 {postReactions[idx].like}</button>
                  <button onClick={() => handleReact(idx, 'laugh')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>😂 {postReactions[idx].laugh}</button>
                  <button onClick={() => handleReact(idx, 'love')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>😍 {postReactions[idx].love}</button>
                  <button onClick={() => handleReact(idx, 'sad')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>😢 {postReactions[idx].sad}</button>
                </div>
                <div style={{ marginBottom: 8 }}>
                  {postComments[idx].map((c, i) => (
                    <div key={i} style={{ fontSize: 14, color: 'var(--text)', marginBottom: 4 }}><strong>{c.user}:</strong> {c.text}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={commentInputs[idx]} onChange={e => handleCommentInput(idx, e.target.value)} placeholder="Add a comment..." style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1.5px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  <button className="button" style={{ borderRadius: 6, background: 'var(--pink)', color: '#fff' }} onClick={() => handleAddComment(idx)}>Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 