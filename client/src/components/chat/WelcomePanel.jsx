import Sprig from "../botanical/Sprig";

const WelcomePanel = () => (
  <div className="relative flex flex-1 flex-col items-center justify-center text-center">
    <Sprig className="pointer-events-none absolute h-[-28rem] text-gold/10" />
    <p className="relative font-display text-5xl text-gold/80">आयुर्वेद</p>
    <h2 className="relative mt-3 font-display text-3xl font-semibold">Ask the ancient texts</h2>
    <p className="relative mt-3 max-w-md text-sm text-parchment/60">
    Every answer is traced back to a classical source, so you can see exactly where it comes from.</p>
  </div>
)

export default WelcomePanel;