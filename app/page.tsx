import { useState } from "react";
import { DemoPlayer } from "./DemoPlayer";
import { ScalingAnimation } from "./ScalingAnimation";
import { BibTeX } from "./BibTeX";
import { ResourceIcon } from "./ResourceIcon";
import { HeroMotion } from "./HeroMotion";
import { HumanVerseAnimation } from "./HumanVerseAnimation";
import { PageTransitions } from "./PageTransitions";
import { ZeroTransfer } from "./ZeroTransfer";
import { ablations, demoScenes, results, type DemoVideo } from "./research";

const stages = [
  { number: "I", title: "Learn interaction", text: "Pretrain on seven egocentric human datasets to learn object interaction and articulated hand motion across diverse activities.", detail: "Egocentric Hand-Motion Pre-training", color: "lavender" },
  { number: "II", title: "Learn coordination", text: "Mid-train on robot-aligned whole-body human data from HumanVerse. The robot-aligned data pipeline converts human demonstrations into the downstream robot observation and action spaces.", detail: "Robot-Aligned Whole-body Human Mid-training", color: "purple" },
  { number: "III", title: "Ground in the robot", text: "Post-train with task-aligned human and native robot demonstrations, grounding shared representations in executable humanoid actions.", detail: "Robot Post-training", color: "orange" },
];

const architectureModules = [
  { id: "navigation-encoder", number: "①", title: "Navigation Encoder" },
  { id: "dino-tok", number: "②", title: "DINO-Tok" },
  { id: "mv-tok", number: "③", title: "Multi-view Encoder" },
  { id: "trajectory-generation", number: "④", title: "Trajectory Planner" },
];

function PaperFigure({ name, alt, caption, width, height, version }: { name: string; alt: string; caption: string; width: number; height: number; version?: string }) {
  const imageUrl = `/figures/${name}.webp${version ? `?v=${version}` : ""}`;
  return (
    <figure className="paper-figure">
      {/* Static, pre-compressed paper figures; preserve their native proportions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Demo({ video, scene, index }: { video: DemoVideo; scene: string; index: number }) {
  return (
    <article className="demo-video" id={video.id}>
      <div className="demo-media">
        {video.videoSrc ? <DemoPlayer video={video} scene={scene} /> : (
          <div className="demo-placeholder" aria-label={`${scene}: ${video.title}, video coming soon`}>
            <span className="demo-placeholder-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span>Video coming soon</span>
          </div>
        )}
      </div>
      <h4 className="demo-video-title">{video.title}</h4>
    </article>
  );
}

export default function Home() {
  const [activeModule, setActiveModule] = useState("navigation-encoder");
  const [architectureNotesOpen, setArchitectureNotesOpen] = useState(false);

  return (
    <main id="main">
      <PageTransitions />
      <a href="#architecture" className="skip-link">Skip to architecture</a>
      <header className="site-header">
        <a className="brand eponax-brand" href="#top" aria-label="EponaX home"><img src="./eponax-wordmark.png" alt="" width={1232} height={402} /><span>EponaX</span></a>
        <nav aria-label="Primary navigation"><a href="#overview">Overview</a><a href="#demos">Demos</a><a href="#architecture">Architecture</a><a href="#data">Data</a><a href="#results">Results</a></nav>
      </header>
      <section className="hero" id="top">
        <div className="hero-content">
          <h1><span className="hero-title"><span className="hero-project-name">EponaX:</span> Scaling World-Action Models for<br className="hero-title-break" /> Real-World Driving</span></h1>
          <div className="hero-team" role="img" aria-label="Horizon Team">
            <img className="horizon-mascot" src="./horizon-mascot.png" alt="" width={1478} height={1064} />
            <svg className="horizon-wordmark" viewBox="0 0 430 105" aria-hidden="true" focusable="false">
              <defs><linearGradient id="horizon-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8bcaff" /><stop offset="1" stopColor="#3879d9" /></linearGradient></defs>
              <text x="8" y="67" fill="url(#horizon-blue)" fontFamily="Avenir Next, Avenir, Arial, sans-serif" fontSize="62" fontWeight="800" fontStyle="italic" letterSpacing="-3">Horizon<tspan dx="16" fontSize="36" letterSpacing="-1.5">Team</tspan></text>
              <g fill="none" stroke="url(#horizon-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 85C115 72 265 91 411 79M162 15a20 20 0 0 1 36 0M180 3V0M154 8l-4-4M206 8l4-4" />
                <g transform="translate(112 0)">
                  <path d="m246 64 7-14h24l10 14 12 4v10h-8m-31 0h18m-30 0h-9V66l7-2Zm8-13-5 13h33l-9-13M266 52v12" />
                  <circle cx="254" cy="78" r="6" /><circle cx="285" cy="78" r="6" />
                </g>
              </g>
            </svg>
          </div>
          <div className="hero-resources" role="group" aria-label="Research resources">
            <a className="resource-link resource-report" href="https://arxiv.org/" target="_blank" rel="noreferrer"><ResourceIcon kind="report" /><span>arXiv</span><ResourceIcon kind="external" /></a>
            <a className="resource-link" href="https://huggingface.co/" target="_blank" rel="noreferrer"><span className="resource-huggingface" aria-hidden="true">🤗</span><span>Hugging Face</span><ResourceIcon kind="external" /></a>
          </div>
        </div>
      </section>
      <section className="content-section section-placeholder" id="overview" aria-labelledby="overview-heading">
        <div className="architecture-header"><h2 id="overview-heading">Overview</h2><p>Project overview coming soon.</p></div>
      </section>
      <section className="content-section section-placeholder" id="demos" aria-labelledby="demos-heading">
        <div className="architecture-header"><h2 id="demos-heading">Demos</h2><p>Driving demonstrations coming soon.</p></div>
      </section>
      <section className="thesis" id="architecture">
        <div className="architecture-header">
          <h2>Architecture</h2>
          <p id="architecture-intro">EponaX integrates visual perception and structured navigation in a causal backbone. TrajLoop turns its layer-wise representations into driving trajectories.{" "}<button type="button" className="architecture-notes-toggle" aria-expanded={architectureNotesOpen} aria-controls="architecture-summary" onClick={() => setArchitectureNotesOpen(!architectureNotesOpen)}>How EponaX works</button></p>
          <div className="architecture-notes" id="architecture-summary" hidden={!architectureNotesOpen}>
            <div className="architecture-caption">
              <div><h3>Inputs &amp; Backbone</h3><p>A frozen DINO-based visual tokenizer encodes the high-resolution front view and compresses five calibrated surround views, while a pretrained navigation encoder maps structured route records into semantically aligned tokens. A causal backbone integrates these inputs into a layer-wise temporal representation.</p></div>
              <div><h3>Training Supervision</h3><p>During training, future visual, depth, and semantic heads provide direct supervision over horizons of up to 20 seconds.</p></div>
              <div><h3>TrajLoop &amp; Deployment</h3><p>TrajLoop pairs the backbone layers with trajectory-DiT blocks and recurrently updates their local conditions across sampling steps. During deployment, only the backbone, TrajLoop, and trajectory decoder are executed.</p></div>
            </div>
          </div>
        </div>
        <figure className="architecture-figure" aria-describedby="architecture-intro">
          <div className="architecture-map">
            <a className="architecture-diagram" href="./figures/eponax-architecture.png" target="_blank" rel="noreferrer" title="Open full-resolution diagram">
              <img src="./figures/eponax-architecture.png" alt="EponaX architecture: visual and navigation encoders feed a causal backbone, with future RGB, depth, and semantic supervision and layer-wise TrajLoop trajectory generation." width={3811} height={1576} loading="lazy" decoding="async" />
            </a>
            <button type="button" className="architecture-encoder encoder-navigation" onClick={() => setActiveModule("navigation-encoder")} aria-controls="navigation-encoder" aria-label="Show Navigation Encoder details" />
            <button type="button" className="architecture-encoder encoder-dino" onClick={() => setActiveModule("dino-tok")} aria-controls="dino-tok" aria-label="Show DINO-Tok details" />
            <button type="button" className="architecture-encoder encoder-multiview" onClick={() => setActiveModule("mv-tok")} aria-controls="mv-tok" aria-label="Show Multi-view Encoder details" />
            <button type="button" className="architecture-encoder encoder-planner" onClick={() => setActiveModule("trajectory-generation")} aria-controls="trajectory-generation" aria-label="Show Trajectory Planner details" />
          </div>
        </figure>
        <div className="architecture-modules">
          <div className="architecture-module-links" role="tablist" aria-label="Architecture module details" onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const currentIndex = architectureModules.findIndex(module => module.id === activeModule);
            const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? architectureModules.length - 1 : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + architectureModules.length) % architectureModules.length;
            const nextModule = architectureModules[nextIndex];
            setActiveModule(nextModule.id);
            document.getElementById(`module-tab-${nextModule.id}`)?.focus({ preventScroll: true });
          }}>
            {architectureModules.map(module => (
              <button type="button" role="tab" key={module.id} id={`module-tab-${module.id}`} data-module={module.id} aria-selected={activeModule === module.id} aria-controls={module.id} tabIndex={activeModule === module.id ? 0 : -1} onClick={() => setActiveModule(module.id)}><span className="module-number">{module.number}</span><span>{module.title}</span></button>
            ))}
          </div>
        <section className="module-detail" id="navigation-encoder" role="tabpanel" aria-labelledby="module-tab-navigation-encoder" tabIndex={0} hidden={activeModule !== "navigation-encoder"}>
          <div className="module-heading"><span className="module-number">①</span><h3 id="navigation-heading">Navigation Encoder</h3></div>
          <p className="module-description">The Navigation Encoder converts structured waypoint, link/lane, and speed information into navigation tokens for the world-model backbone. It is pretrained through navigation alignment, then kept frozen during world-model training and inference.</p>
          <h4 className="module-subheading">Encoder Structure</h4>
          <figure className="module-figure">
            <a className="architecture-diagram" href="./figures/navigation-encoder.png" target="_blank" rel="noreferrer" title="Open full-resolution Navigation Encoder diagram"><img src="./figures/navigation-encoder.png" alt="Navigation Encoder structure: waypoint, link, and speed-limit branches are combined through global self-attention and a navigation projector into navigation soft tokens." width={5178} height={1573} loading="lazy" decoding="async" /></a>
            <figcaption>
              <p>Waypoint, link/lane, and speed branches produce tokens that are concatenated with three separators, fused by global self-attention, and projected into the backbone hidden space. The figure uses <i>K</i> waypoint tokens and <i>L</i> link slots, giving <i>T</i><sub>nav</sub> = <i>K</i> + <i>L</i> + 4 tokens; this sequence length is denoted by <i>N</i><sub>nav</sub> in the text.</p>
              <p>All encoder branches and the projector are trainable during navigation alignment and frozen during subsequent world-model training and inference.</p>
            </figcaption>
          </figure>
          <h4 className="module-subheading">Pretrain Pipeline</h4>
          <figure className="module-figure">
            <a className="architecture-diagram" href="./figures/navigation-pretraining.png" target="_blank" rel="noreferrer" title="Open full-resolution Pretrain Pipeline diagram"><img src="./figures/navigation-pretraining.png" alt="Navigation pretraining: offline teacher descriptions supervise navigation soft tokens through a frozen language model, with an auxiliary decoder reconstructing navigation fields." width={5206} height={1900} loading="lazy" decoding="async" /></a>
            <figcaption>
              <p>Qwen3.6 35B generates target text offline. A separate frozen Qwen3-VL 2B language model predicts these targets from navigation tokens under teacher forcing; cross-entropy is evaluated only on target-text positions. Gradients pass through the frozen language model to the encoder and projector.</p>
              <p>The auxiliary decoder reconstructs link, lane, and speed fields from the final-layer navigation hidden states; it does not reconstruct waypoints. Only the encoder and projector are retained for the world-model navigation pathway.</p>
            </figcaption>
          </figure>
        </section>
        <section className="module-detail" id="dino-tok" role="tabpanel" aria-labelledby="module-tab-dino-tok" tabIndex={0} hidden={activeModule !== "dino-tok"}>
          <div className="module-heading"><span className="module-number">②</span><h3 id="dino-heading">DINO-Tok</h3></div>
          <p className="module-description">DINO-Tok adapts a frozen DINO encoder into a visual tokenizer by combining deep semantic features with shallow appearance features. Its visual latents preserve both structural scene information and reconstructable visual detail, with support for continuous autoencoding and discrete tokenization.</p>
          <figure className="module-figure">
            <a className="architecture-diagram" href="./figures/dino-tok.png" target="_blank" rel="noreferrer" title="Open full-resolution DINO-Tok diagram"><img src="./figures/dino-tok.png" alt="DINO-Tok reference architecture: frozen DINO texture and semantic features feed continuous AE or discrete VQ tokenization, with Dominant-Subspace Quantization in the VQ variant." width={3306} height={1534} loading="lazy" decoding="async" /></a>
            <figcaption>
              <p>In EponaX, a shared frozen DINO-Tok encoder maps all six camera views into visual latents that capture both semantic information and appearance detail. For the front view, we retain a dense spatial feature grid of <i>N</i><sub>f</sub> = <i>H</i><sub>f</sub><i>W</i><sub>f</sub> tokens; a separate token-shuffle operation reduces its sequence length before the shared backbone.</p>
              <p>The five surround-view feature grids are further compressed by the Multi-view Encoder before entering the shared backbone. The same frozen DINO-Tok encoder also provides front-view targets for future visual prediction.</p>
            </figcaption>
          </figure>
          <p className="module-source">Reference: <a href="https://arxiv.org/abs/2511.20565" target="_blank" rel="noreferrer">DINO-Tok: Adapting DINO for Visual Tokenizers ↗</a></p>
        </section>
        <section className="module-detail" id="mv-tok" role="tabpanel" aria-labelledby="module-tab-mv-tok" tabIndex={0} hidden={activeModule !== "mv-tok"}>
          <div className="module-heading"><span className="module-number">③</span><h3 id="mv-tok-heading">Multi-view Encoder</h3></div>
          <p className="module-description">The Multi-view Encoder provides EponaX with surround-view context, complementing the front-view pathway with information about the vehicle's broader surroundings.</p>
          <figure className="module-figure">
            <a className="architecture-diagram" href="./figures/mv-tok.png" target="_blank" rel="noreferrer" title="Open full-resolution Multi-view Encoder diagram"><img src="./figures/mv-tok.png" alt="Multi-view Encoder architecture: frozen DINO-Tok features enter semantic and high-frequency compression branches with camera and ray geometry, followed by feature reconstruction during pretraining and optional RGB visualization." width={6000} height={1884} loading="lazy" decoding="async" /></a>
            <figcaption>
              <p>A frozen DINO-Tok encoder extracts semantic and high-frequency features from five calibrated surround-view images. Two complementary branches compress these features using strided convolution and pixel-unshuffle, respectively, followed by geometry-aware cross-view self-attention.</p>
              <p>The resulting compact latents preserve both scene structure and fine-grained details. During pretraining, a semantic-conditioned decoder reconstructs the original DINO features, while RGB reconstruction is used only for visualization.</p>
            </figcaption>
          </figure>
        </section>
        <section className="module-detail" id="trajectory-generation" role="tabpanel" aria-labelledby="module-tab-trajectory-generation" tabIndex={0} hidden={activeModule !== "trajectory-generation"}>
          <div className="module-heading"><span className="module-number">④</span><h3 id="trajectory-heading">Trajectory Planner</h3></div>
          <p className="module-description">The trajectory planner turns EponaX's shared feature hierarchy into future ego motion. It builds on WALT's world-model-aligned trajectory latent space and introduces TrajLoop through <strong>block-wise feature injection</strong> and <strong>recurrent conditioning across sampling steps</strong>.</p>
          <figure className="module-figure">
            <a className="architecture-diagram" href="./figures/walt.png" target="_blank" rel="noreferrer" title="Open full-resolution WALT trajectory pipeline"><img src="./figures/walt.png" alt="WALT two-stage pipeline: world-model-aligned semantic and geometric trajectory autoencoding, followed by latent trajectory planning and decoding conditioned on world-state tokens." width={5756} height={2795} loading="lazy" decoding="async" /></a>
            <figcaption>
              <p>WALT first learns a compact trajectory latent space with a dual-branch autoencoder. The semantic branch aligns trajectory features with the states of a frozen driving world model, while the geometric branch preserves the information needed to reconstruct metric waypoints.</p>
              <p>In the second stage, the trajectory tokenizer is frozen and a conditional flow-matching planner learns to generate aligned trajectory latents from world-model states. The frozen trajectory decoder converts these latents back into future waypoints. The figure illustrates this WALT reference pipeline; EponaX extends its planner with TrajLoop as described below.</p>
            </figcaption>
          </figure>
          <p className="module-source">Reference: <a href="https://arxiv.org/abs/2609.30436" target="_blank" rel="noreferrer">WALT: Learning World-Model-Aligned Latent Trajectories for Autonomous Driving ↗</a></p>
          <h4 className="module-subheading">From WALT to TrajLoop</h4>
          <p className="module-description"><strong>Block-wise feature injection.</strong> Instead of conditioning the planner only on the final backbone layer, we pair TrajDiT's 28 interaction blocks with the corresponding layers of EponaX's shared backbone. Each block accesses its own layer-aligned condition, exposing the planner to the complete feature hierarchy while generating trajectory latents through conditional flow matching.</p>
          <p className="module-description"><strong>Recurrent conditioning.</strong> TrajLoop lets these local conditions evolve with the trajectory hypothesis rather than reusing fixed backbone features throughout sampling. Each block's cross-attention response updates that same block's condition for the next sampling step. After all blocks finish, the updated condition set is used at the next step. The flow-matching schedule and solver stay unchanged: five Euler steps produce the final latent, which the frozen WALT decoder converts into the future ego trajectory.</p>
        </section>
        </div>
      </section>
      {/*
      <section className="content-section demos-section" id="demos">
        <div className="section-intro"><div><p className="section-label">Real-world demonstrations</p><h2>Move. Reach. Manipulate.</h2></div><p>Whole-body loco-manipulation across the laboratory, break room, and visitor center.</p></div>
        {demoScenes.filter(scene => scene.videos.some(video => video.videoSrc)).map(scene => (
          <section className="demo-scene" key={scene.id} aria-labelledby={`${scene.id}-heading`}>
            <div className="demo-scene-heading"><h3 id={`${scene.id}-heading`}>{scene.title}</h3></div>
            <div className={`demo-grid demo-grid-${scene.id}`} tabIndex={0} role="region" aria-label={`${scene.title} demonstration videos`}>
              {scene.videos.map((video, index) => <Demo key={video.id} video={video} scene={scene.title} index={index} />)}
            </div>
          </section>
        ))}
      </section>
      <ZeroTransfer />
      <section className="content-section data-section" id="data">
        <div className="section-intro"><div><p className="section-label">HumanVerse</p><h2>Capture the body.<br />Keep the context.</h2></div><p>500 hours of robot-free capture across open-world scenes and tasks, pairing egocentric video with synchronized whole-body and hand motion.</p></div>
        <HumanVerseAnimation />
        <div className="dataset-motion" id="humanverse-gallery"><HeroMotion /></div>
          <div className="dataset-motion dataset-retargeting"><HeroMotion comparison /></div>
        <div className="modality-columns"><article><h3>Egocentric vision</h3><p>A neck-mounted GoPro records first-person RGB at a height matched to the robot camera, retaining the objects and surroundings that give actions their context.</p></article><article><h3>24 body joints</h3><p>Wearable PICO tracking captures global displacement, posture, and coordinated body motion on a synchronized timeline.</p></article><article><h3>21 joints per hand</h3><p>Image-based hand reconstruction estimates articulated hand geometry, complementing directly tracked body motion.</p></article></div>
        <div className="data-note"><strong>Robot-Aligned Data Pipeline</strong><p>Observation alignment matches the egocentric camera to the robot view. For action-space alignment, the three steps below correct the human reference, fit a robot reference through whole-body IK and SONIC rollout, then refine motion with dynamics-aware optimization.</p></div>
        <PaperFigure name="alignment" version="20261012-alpha2" width={2242} height={857} alt="Three-stage alignment pipeline: human-reference alignment, robot-reference alignment, and dynamics-aware optimization" caption="The alignment pipeline turns human motion into robot-compatible motion through human-reference correction, robot-reference alignment, and dynamics-aware refinement." />
        <div className="data-note"><strong>Efficient Robot-Free Collection</strong><p>Estimated time per demo: approximately 70 s robot / 33 s human for whole-body manipulation, and 130 s robot / 25 s human for long-range loco-manipulation. Equal weighting gives approximately 100 s versus 29 s, or 3.4× collection throughput across these representative families.</p></div>
        <div className="data-note"><strong>Separate data for embodiment grounding.</strong><p>An additional 600 task-aligned human demonstrations—150 per task—are reserved for Stage III and excluded from the 500-hour mid-training pool. Sessions are split before temporal windows are constructed.</p></div>
      </section>
      <section className="content-section training-section" id="training">
        <div className="section-intro"><div><p className="section-label">The λ₀ training recipe</p><h2>From interaction priors<br />to humanoid actions.</h2></div><p>A shared vision–language backbone and action expert learn across human and robot data, while embodiment-specific interfaces preserve their different physical meanings.</p></div>
        <div className="pipeline">{stages.map(stage => <article className={`stage-card ${stage.color}`} key={stage.number}><div className="stage-topline"><span>Stage {stage.number} · {stage.detail}</span><i aria-hidden="true" /></div><h3>{stage.title}</h3><p>{stage.text}</p></article>)}</div>
        <PaperFigure name="training" version="c12bc09179" width={2856} height={900} alt="Updated three-stage training pipeline with egocentric hand-motion pretraining, whole-body human mid-training, and robot post-training" caption="The shared model learns from human interactions, whole-body motion, and embodiment-specific demonstrations." />
        <div className="deployment-note"><h3>At deployment</h3><p>The policy takes the robot’s camera image, language instruction, and proprioception. It predicts whole-body motion tokens and hand commands; SONIC executes the body motion. Human tracking is used during data collection, not at deployment.</p></div>
      </section>
      <section className="content-section results-section" id="evaluation">
        <div className="section-intro"><div><p className="section-label">Evaluation results</p><h2>Coordinated action.<br />Measurable progress.</h2></div><p>We report both completed tasks and milestone-weighted progress. The two metrics distinguish terminal success from useful partial execution.</p></div>
        <details className="research-details" open><summary>Robot hardware and evaluation scenes</summary><p>The Unitree G1 uses BrainCo Revo 2 hands and a head-mounted GoPro. PICO body tracking and HexaCercle M11 gloves provide teleoperation demonstrations, with SONIC translating whole-body motion into robot control.</p><PaperFigure name="evaluation" width={2400} height={816} alt="Teleoperation hardware, four real-world task sequences, and evaluation objects" caption="The paper’s hardware setup, task sequences, and robot-seen and robot-unseen objects." /></details>
        <div className="result-highlights"><article><strong>62.5<span>%</span></strong><h3>Real-world success</h3><p>25 of 40 trials completed; +22.5 percentage points over the strongest external baseline.</p></article><article><strong>80.4<span>%</span></strong><h3>Real-world progress</h3><p>Average over four tasks; +25.8 percentage points over the strongest external baseline.</p></article><article><strong>90.0<span>%</span></strong><h3>SIMPLE success</h3><p>Six core tasks, three difficulty levels, 180 trials. Uses the best recorded configuration per task.</p></article></div>
        <div className="comparison-heading"><h3>Real-world comparison</h3><p>Higher is better · four tasks, 40 trials per method</p></div>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Real-world results table"><table className="results-table"><caption className="sr-only">Real-world success and task progress</caption><thead><tr><th scope="col">Method</th><th scope="col">Success (%)</th><th scope="col">Task progress (%)</th></tr></thead><tbody>{results.map(row => <tr key={row.name} className={row.name === "λ₀ (Ours)" ? "ours" : undefined}><th scope="row">{row.name}</th>{(["success", "progress"] as const).map(metric => <td key={metric}><div className={`metric-cell ${metric}`}><span className="metric-track" aria-hidden="true"><i style={{ width: `${row[metric]}%` }} /></span><strong>{row[metric].toFixed(1)}</strong></div></td>)}</tr>)}</tbody></table></div>
        <details className="research-details"><summary>Training-stage ablations</summary><p>All variants retain vision–language initialization and Stage III. Removing Stage II causes a larger real-world success drop than removing Stage I.</p><div className="table-scroll" tabIndex={0} role="region" aria-label="Training-stage ablations table"><table className="results-table ablation-table"><caption className="sr-only">Real-world training-stage ablations</caption><thead><tr><th scope="col">Training recipe</th><th scope="col">Success (%)</th><th scope="col">Progress (%)</th></tr></thead><tbody>{ablations.map(row => <tr key={row.name} className={row.name === "Full recipe" ? "ours" : undefined}><th scope="row">{row.name}<small>{row.description}</small></th><td>{row.success.toFixed(1)}</td><td>{row.progress.toFixed(1)}</td></tr>)}</tbody></table></div></details>
      </section>
      <section className="content-section scaling-section" id="scaling">
        <div className="section-intro"><div><p className="section-label">Human Data Scaling</p><h2>More experience.<br />Lower validation loss.</h2></div><p>With a fixed 2B model and 100k Stage-II updates, nested human-data subsets let us study how data quantity changes learning.</p></div>
        <ScalingAnimation />
        <div className="scaling-findings"><article><h3>Two fixed holdouts</h3><p>From 5% to 100% data, minimum loss decreases by <strong>35.5%</strong> on the representative holdout and <strong>40.6%</strong> on the clean holdout. Both are disjoint from training sessions.</p></article><article><h3>Downstream task progress</h3><div className="endpoint-comparison"><div><span>No Stage II</span><strong>59.9<small>%</small></strong></div><span className="endpoint-gain">+20.5 pts</span><div><span>Full recipe</span><strong>80.4<small>%</small></strong></div></div><p>Intermediate scales reach 64.2%, 67.3%, 72.1%, and 76.4% task progress at 5%, 10%, 25%, and 50% Stage-II data, respectively. Robot demonstrations and the Stage-III training budget are fixed.</p></article></div>
      </section>
      */}
      <section className="content-section section-placeholder" id="data" aria-labelledby="data-heading">
        <div className="architecture-header"><h2 id="data-heading">Data</h2><p>Training data details coming soon.</p></div>
      </section>
      <section className="content-section section-placeholder" id="results" aria-labelledby="results-heading">
        <div className="architecture-header"><h2 id="results-heading">Results</h2><p>Evaluation results coming soon.</p></div>
      </section>
      <BibTeX />
      <footer><a className="footer-brand eponax-brand" href="#top" aria-label="EponaX home"><img src="./eponax-logo.png?v=2" alt="" width={34} height={34} /><span>EponaX</span></a><a className="footer-top" href="#top">Back to top ↑</a></footer>
    </main>
  );
}
