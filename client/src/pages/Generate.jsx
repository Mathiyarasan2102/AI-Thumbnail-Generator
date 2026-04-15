import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import { colorSchemes } from "../assets/assets";
import StyleSelector from '../components/StyleSelector'
import ColorSchemeSelector from '../components/ColorSchemeSelector'
import PreviewPanel from "../components/PreviewPanel";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import api from "../configs/api";

const Generate = () => {
  const { id } = useParams();
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { isLoggedIn } = useAuth()
  const [title, setTitle] = useState('');
  const [additionaldetails, setAdditionalDetails] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [colorSchemeId, setColorSchemeId] = useState(colorSchemes[0].id);
  const [style, setStyle] = useState('Bold & Graphic');
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      return toast.error('Please login to generate thumbnails')
    }
    if (!title.trim()) return toast.error('Title is required')
    setLoading(true)

    const api_payload = {
      title,
      prompt: additionaldetails,
      style,
      aspect_ratio: aspectRatio,
      color_scheme: colorSchemeId,
      text_overlay: true,
    }

    const { data } = await api.post('/api/thumbnail/generate', api_payload);

    if (data.thumbnail) {
      navigate('/generate/' + data.thumbnail._id)
      toast.success(data.message)
    }
  }

  const fetchThumbnail = async () => {
    try {
      const { data } = await api.get(`/api/user/thumbnail/${id}`)
      setThumbnail(data?.thumbnail)
      setLoading(!data?.thumbnail?.image_url);
      setAdditionalDetails(data?.thumbnail?.user_prompt)
      setTitle(data?.thumbnail?.title)
      setColorSchemeId(data?.thumbnail?.color_scheme)
      setAspectRatio(data?.thumbnail?.aspect_ratio)
      setStyle(data?.thumbnail?.style)

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchThumbnail()
    } else {
      setThumbnail(null)
      setAdditionalDetails('')
      setTitle('')
      setColorSchemeId(colorSchemes[0].id)
      setAspectRatio('16:9')
      setStyle('Bold & Graphic')
    }
    if (id && loading && isLoggedIn) {
      const interval = setInterval(() => {
        fetchThumbnail()
      }, 5000);
      return () => clearInterval(interval)
    }
  }, [id, loading, isLoggedIn])

  useEffect(() => {
    if (!id && thumbnail) {
      setThumbnail(null)
    }
  }, [pathname])


  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Column */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail</h2>
                  <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life!</p>
                </div>
                <div className="space-y-5">
                  {/* Title Input */}
                  <div className="space-x-2 space-y-1">
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="e.g., 10 Tips for Better Sleep" className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                    <div className="flex justify-end space-y-1">
                      <span className="text-xs text-zinc-400">{title.length}/100</span>
                    </div>
                  </div>
                  {/* AspectRatioSelector */}
                  <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                  {/* StyleSelector */}
                  <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen} />
                  {/* ColorSchemeSelector */}
                  <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                  {/* Details */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Details <span className="text-xs text-zinc-400">(Optional)</span>
                    </label>
                    <textarea value={additionaldetails} onChange={(e) => setAdditionalDetails(e.target.value)} rows={3} placeholder="Add any specific elements, mood, or style preferences..." className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
                  </div>

                </div>

                {/*Button */}
                {!id && (
                  <button onClick={handleGenerate} className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors">
                    {loading ? 'Generating...' : 'Generate Thumbnail'}
                  </button>
                )

                }
              </div>
            </div>
            {/* Right Column */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />
              </div>
            </div>
          </div>
        </main>

      </div>
    </>
  )
}

export default Generate