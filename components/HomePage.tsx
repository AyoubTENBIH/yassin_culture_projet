"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#intro", label: "مقدمة" },
  { href: "#history", label: "التاريخ" },
  { href: "#architecture", label: "العمارة" },
  { href: "#culture", label: "الثقافة" },
  { href: "#crafts", label: "الحرف" },
  { href: "#nature", label: "الطبيعة" },
  { href: "#cuisine", label: "المطبخ" },
  { href: "#preserve", label: "الحفاظ" },
];

const STATS = [
  { target: 15, label: "معالم وصور تراثية" },
  { target: 7, label: "أقسام ثقافية" },
  { target: 3, label: "فنون شعبية رئيسية" },
  { target: 5, label: "أطباق تقليدية" },
];

const HERITAGE_ITEMS = [
  {
    image: "/images/kasbah.jpg",
    caption: "قصبة أكادير أوفلا — القرن السادس عشر",
    title: "قصبة أكادير أوفلا",
    description:
      "شُيِّدت في القرن السادس عشر لحماية المدينة من الهجمات الخارجية. ورغم تعرضها لأضرار كبيرة إثر زلزال 1960، فإنها لا تزال شاهدة على تاريخ المنطقة العريق.",
  },
  {
    image: "/images/taroudant.jpg",
    caption: "الأسوار التاريخية لمدينة تارودانت",
    title: "مدينة تارودانت التاريخية",
    description:
      'تُلقَّب بـ"مراكش الصغيرة" بسبب أسوارها العريقة ومعالمها التاريخية. وقد كانت عاصمة للدولة السعدية، مما منحها أهمية سياسية وتاريخية كبيرة.',
  },
  {
    image: "/images/atlas.jpg",
    caption: "إكودار — المخازن الجماعية الأمازيغية",
    title: "المخازن الجماعية (إكودار)",
    description:
      "من أبرز الشواهد المعمارية التقليدية الأمازيغية، حيث كانت تُستعمل لتخزين الحبوب والمؤن والممتلكات الثمينة للسكان.",
  },
];

const CRAFTS = [
  { image: "/images/zarbiya.jpg", caption: "الزرابي السوسية", label: "الزرابي السوسية" },
  { image: "/images/holi.jpg", caption: "الحلي الفضية الأمازيغية", label: "الحلي الفضية الأمازيغية" },
  { image: "/images/fakhkhar.jpg", caption: "صناعة الفخار التقليدي", label: "صناعة الفخار التقليدي" },
];

const CUISINE_ITEMS = [
  { name: "أملو", description: "خليط من زيت الأركان واللوز العضوي والعسل الطبيعي" },
  { name: "الكسكس السوسي", description: "يُحضَّر بطرق تقليدية خاصة بالمناسبات والأعراس" },
  { name: "الطاجين", description: "بأنواعه المختلفة اعتمادًا على المنتجات المحلية الطازجة" },
  { name: "زيت الأركان", description: "من أشهر منتجات المنطقة وأكثرها شهرة على المستوى العالمي" },
];

const PRESERVE_ITEMS = [
  { icon: "★", title: "تعزيز الهوية الثقافية", text: "نقل التراث إلى الأجيال الصاعدة وتعزيز الانتماء" },
  { icon: "✈", title: "تنمية السياحة الثقافية", text: "جذب الزوار من مختلف أنحاء العالم" },
  { icon: "⚖", title: "حماية الموروث", text: "الحفاظ على التراث من الاندثار والنسيان" },
  { icon: "♦", title: "دعم الاقتصاد المحلي", text: "تشجيع الصناعات التقليدية والحرف اليدوية" },
  { icon: "🌍", title: "التعريف العالمي", text: "إبراز تاريخ المنطقة وثقافتها وطبيعتها" },
];

type LightboxState = { src: string; caption: string } | null;

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [heroOffset, setHeroOffset] = useState(0);
  const [statValues, setStatValues] = useState<number[]>(STATS.map(() => 0));
  const statsAnimated = useRef(false);

  const openLightbox = useCallback((src: string, caption: string) => {
    setLightbox({ src, caption });
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setHeroOffset(window.scrollY < window.innerHeight ? window.scrollY * 0.3 : 0);

      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      let current = "";
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const statsEl = document.querySelector(".stats");
    if (!statsEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || statsAnimated.current) return;
        statsAnimated.current = true;

        STATS.forEach((stat, index) => {
          let current = 0;
          const step = Math.max(1, Math.floor(stat.target / 30));
          const timer = setInterval(() => {
            current += step;
            if (current >= stat.target) {
              current = stat.target;
              clearInterval(timer);
            }
            setStatValues((prev) => {
              const next = [...prev];
              next[index] = current;
              return next;
            });
          }, 40);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox]);

  const navClass = `navbar${scrolled ? " scrolled" : " hero-nav"}`;

  return (
    <>
      <nav className={navClass}>
        <a href="#home" className="logo">
          تراث سوس ماسة
        </a>
        <button
          className={`menu-toggle${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="القائمة"
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={activeSection === link.href.slice(1) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="hero" id="home">
        <div
          className="hero-bg"
          style={{ transform: `scale(1.05) translateY(${heroOffset}px)` }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">المملكة المغربية — جهة سوس ماسة</span>
          <h1>تراث جهة سوس ماسة</h1>
          <div className="hero-divider" />
          <p>دراسة في الموروث الحضاري والثقافي والطبيعي</p>
          <div className="hero-student">
            <span>
              الطالب: <strong>Yassin Tenbih</strong>
            </span>
            <span className="sep" />
            <span>
              القسم: <strong>3/6</strong>
            </span>
          </div>
          <a href="#intro" className="hero-cta">
            اكتشف التراث ↓
          </a>
        </div>
        <div className="scroll-indicator">
          <span />
        </div>
      </header>

      <div className="pattern-bar" />

      <section id="intro">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">البداية</span>
            <h2>مقدمة</h2>
            <div className="line" />
          </div>
          <div className="intro-box reveal">
            تُعد جهة سوس ماسة من أهم الجهات المغربية من حيث الغنى الحضاري والثقافي والتاريخي.
            تقع في جنوب المغرب، وتمتد بين الساحل الأطلسي وسلسلة جبال الأطلس الصغير، مما جعلها
            ملتقى للحضارات والثقافات المختلفة عبر التاريخ. وتتميز الجهة بتراث مادي ولا مادي غني
            يعكس أصالة المنطقة وتنوع مكوناتها الأمازيغية والعربية والإفريقية.
          </div>
          <p className="intro-text reveal">
            ويشكل التراث السوسي ركيزة أساسية للحفاظ على الهوية الثقافية للمنطقة، كما يساهم في
            التنمية الاقتصادية والسياحية من خلال جذب الزوار والباحثين المهتمين بالثقافة والتاريخ.
          </p>
          <div className="stats reveal">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-number">{statValues[i]}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="history">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">الجذور</span>
            <h2>التراث التاريخي</h2>
            <div className="line" />
            <p>
              عرفت منطقة سوس ماسة استقرار الإنسان منذ عصور قديمة، ولعبت دورًا مهمًا في التجارة بين
              شمال إفريقيا وبلدان إفريقيا جنوب الصحراء.
            </p>
          </div>
          <div className="heritage-grid">
            {HERITAGE_ITEMS.map((item) => (
              <article key={item.title} className="heritage-card reveal">
                <div
                  className="img-wrap"
                  onClick={() => openLightbox(item.image, item.caption)}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(item.image, item.caption)}
                  role="button"
                  tabIndex={0}
                >
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div className="img-overlay">
                    <span>عرض الصورة</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">البناء</span>
            <h2>التراث المعماري</h2>
            <div className="line" />
            <p>يتميز بالاعتماد على المواد المحلية كالطين والحجر والخشب، مع مراعاة الظروف المناخية للمنطقة.</p>
          </div>
          <div className="split-section">
            <div className="split-images reveal">
              {[
                { src: "/images/maison.jpg", caption: "نموذج منزل تقليدي سوسي", alt: "منزل تقليدي سوسي" },
                { src: "/images/kasbah.jpg", caption: "قصبة تاريخية — سوس ماسة", alt: "قصبة تاريخية" },
                { src: "/images/agadirofla.jpg", caption: "أكادير أوفلا", alt: "أكادير أوفلا" },
              ].map((img) => (
                <div
                  key={img.src}
                  className="img-card"
                  onClick={() => openLightbox(img.src, img.caption)}
                  role="button"
                  tabIndex={0}
                >
                  <Image src={img.src} alt={img.alt} width={400} height={300} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 180 }} />
                </div>
              ))}
            </div>
            <div className="split-content reveal">
              <h3>المنازل التقليدية والقصبات</h3>
              <p>
                بُنيت المنازل التقليدية وفق هندسة تتلاءم مع البيئة المحلية، حيث تتميز بالجدران السميكة
                والنوافذ الصغيرة للحفاظ على البرودة صيفًا والدفء شتاءً.
              </p>
              <ul className="feature-list">
                <li>استخدام الطين والحجر والخشب المحلي</li>
                <li>جدران سميكة للعزل الحراري</li>
                <li>نوافذ صغيرة لحماية المناخ</li>
                <li>قصبات دفاعية تاريخية</li>
                <li>تصميم يتناسب مع البيئة الصحراوية</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="culture" className="culture-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">الروح</span>
            <h2>التراث الثقافي واللامادي</h2>
            <div className="line" style={{ background: "linear-gradient(90deg, var(--accent-light), var(--accent))" }} />
            <p>يشمل جميع الممارسات والتقاليد والعادات التي توارثتها الأجيال عبر الزمن.</p>
          </div>
          <div className="culture-grid">
            <article className="culture-card reveal">
              <div className="card-body" style={{ paddingBottom: 0 }}>
                <h3>اللغة الأمازيغية — تاشلحيت</h3>
                <p>تُعتبر اللغة الأمازيغية السوسية (تاشلحيت) من أهم عناصر الهوية الثقافية للجهة، حيث يتحدث بها معظم سكان المنطقة.</p>
              </div>
              <div className="img-wrap" onClick={() => openLightbox("/images/rways.jpg", "فن الروايس — إرث سوسي عريق")} role="button" tabIndex={0}>
                <Image src="/images/rways.jpg" alt="فن الروايس" fill sizes="33vw" style={{ objectFit: "cover" }} />
              </div>
              <div className="card-body">
                <h3>فن الروايس</h3>
                <p>من أشهر الفنون الموسيقية في سوس ماسة، يجمع بين الشعر والغناء والعزف على الآلات التقليدية.</p>
                <div className="artists-list">
                  {["الحاج بلعيد", "الرايس سعيد اشتوك", "الرايسة فاطمة تبعمرانت"].map((a) => (
                    <span key={a} className="artist-tag">{a}</span>
                  ))}
                </div>
              </div>
            </article>
            <article className="culture-card reveal">
              <div className="img-wrap" onClick={() => openLightbox("/images/ahwach.jpg", "رقصة أحواش — تراث إنساني مشترك")} role="button" tabIndex={0}>
                <Image src="/images/ahwach.jpg" alt="رقصة أحواش" fill sizes="33vw" style={{ objectFit: "cover" }} />
              </div>
              <div className="card-body">
                <h3>رقصة أحواش</h3>
                <p>من أهم الفنون الشعبية بالمنطقة، حيث يشارك الرجال والنساء في أداء جماعي يجمع بين الغناء والرقص والشعر.</p>
              </div>
            </article>
            <article className="culture-card reveal">
              <div className="card-body">
                <h3>تراث إنساني مشترك</h3>
                <p>تجمع الفنون السوسية بين الأصالة الأمازيغية والتأثيرات العربية والإفريقية، مما يجعلها تراثًا إنسانيًا فريدًا يستحق الحفاظ عليه والتعريف به عالميًا.</p>
                <div className="artists-list" style={{ marginTop: "1.5rem" }}>
                  {["الغناء الجماعي", "الشعر الشعبي", "الآلات التقليدية", "الاحتفالات المحلية"].map((t) => (
                    <span key={t} className="artist-tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="crafts">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">الإبداع</span>
            <h2>التراث الحرفي والصناعات التقليدية</h2>
            <div className="line" />
            <p>تشتهر جهة سوس ماسة بالعديد من الحرف التقليدية التي تعكس مهارة الصناع المحليين وإبداعهم.</p>
          </div>
          <div className="crafts-gallery reveal">
            {CRAFTS.map((craft) => (
              <div key={craft.label} className="craft-item" onClick={() => openLightbox(craft.image, craft.caption)} role="button" tabIndex={0}>
                <Image src={craft.image} alt={craft.label} fill sizes="33vw" style={{ objectFit: "cover" }} />
                <div className="craft-label">{craft.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nature" className="nature-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">الجمال الطبيعي</span>
            <h2>التراث الطبيعي</h2>
            <div className="line" />
            <p>إلى جانب التراث الثقافي، تزخر جهة سوس ماسة بتراث طبيعي غني يجمع بين الجبال والشواطئ والوديان.</p>
          </div>
          <div className="nature-showcase reveal">
            <div className="nature-main" onClick={() => openLightbox("/images/parc.jpg", "المنتزه الوطني لسوس ماسة")} role="button" tabIndex={0}>
              <Image src="/images/parc.jpg" alt="المنتزه الوطني لسوس ماسة" width={800} height={500} style={{ width: "100%", height: "100%", minHeight: 400, objectFit: "cover" }} />
              <div className="caption">
                <h3>المنتزه الوطني لسوس ماسة</h3>
                <p>محمية طبيعية بارزة تحتضن تنوعًا بيولوجيًا فريدًا</p>
              </div>
            </div>
            <div className="nature-side">
              <div className="nature-side-item" onClick={() => openLightbox("/images/wadi.jpg", "وادي الجنة — جمال الطبيعة السوسية")} role="button" tabIndex={0}>
                <Image src="/images/wadi.jpg" alt="وادي الجنة" fill sizes="50vw" style={{ objectFit: "cover" }} />
                <div className="caption">وادي الجنة — Paradise Valley</div>
              </div>
              <div className="nature-side-item" onClick={() => openLightbox("/images/legzira.jpg", "شاطئ ليكزيرا — الأقواس الصخرية")} role="button" tabIndex={0}>
                <Image src="/images/legzira.jpg" alt="شاطئ ليكزيرا" fill sizes="50vw" style={{ objectFit: "cover" }} />
                <div className="caption">شاطئ ليكزيرا — الأقواس الصخرية</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cuisine" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">الذوق السوسي</span>
            <h2>المطبخ التقليدي السوسي</h2>
            <div className="line" />
            <p>مطبخ غني بالنكهات الأصيلة والمنتجات المحلية الفريدة.</p>
          </div>
          <div className="cuisine-grid">
            <div className="cuisine-table reveal">
              <table>
                <thead>
                  <tr>
                    <th>المنتج / الطبق</th>
                    <th>الوصف</th>
                  </tr>
                </thead>
                <tbody>
                  {CUISINE_ITEMS.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cuisine-images reveal">
              <div className="cuisine-img" onClick={() => openLightbox("/images/amlu.jpg", "أملو — لذة سوسية أصيلة")} role="button" tabIndex={0}>
                <Image src="/images/amlu.jpg" alt="أملو" width={400} height={200} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div className="label">أملو — لذة سوسية أصيلة</div>
              </div>
              <div className="cuisine-img" onClick={() => openLightbox("/images/argan.jpg", "شجرة الأركان — كنز سوس ماسة")} role="button" tabIndex={0}>
                <Image src="/images/argan.jpg" alt="شجرة الأركان" width={400} height={200} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <div className="label">شجرة الأركان — كنز سوس ماسة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="preserve" className="preserve-section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">المسؤولية</span>
            <h2>أهمية المحافظة على التراث</h2>
            <div className="line" />
          </div>
          <div className="preserve-grid reveal">
            {PRESERVE_ITEMS.map((item) => (
              <div key={item.title} className="preserve-card">
                <div className="preserve-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="conclusion">
        <div className="container reveal">
          <h2>خاتمة</h2>
          <div className="divider" />
          <p>
            يمثل تراث جهة سوس ماسة ثروة حضارية وثقافية فريدة تعكس تاريخ المنطقة العريق وتنوع
            مكوناتها الثقافية والطبيعية. ويظل الحفاظ على هذا التراث مسؤولية جماعية تتطلب تضافر
            جهود المؤسسات والمجتمع المدني والأفراد.
          </p>
          <p>
            ومن خلال العناية بالمعالم التاريخية والفنون التقليدية والعادات المتوارثة، تواصل جهة
            سوس ماسة الحفاظ على مكانتها كإحدى أغنى الجهات المغربية تراثًا وثقافة.
          </p>
        </div>
      </section>

      <footer>
        <div className="flag-line">
          <span />
          <strong>المملكة المغربية — جهة سوس ماسة</strong>
          <span />
        </div>
        <p>تراث جهة سوس ماسة — دراسة في الموروث الحضاري والثقافي والطبيعي</p>
      </footer>

      <div
        className={`lightbox${lightbox ? " active" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeLightbox()}
      >
        <button className="lightbox-close" onClick={closeLightbox} aria-label="إغلاق">
          ✕
        </button>
        {lightbox && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.src} alt={lightbox.caption} />
            <div className="lightbox-caption">{lightbox.caption}</div>
          </>
        )}
      </div>
    </>
  );
}
