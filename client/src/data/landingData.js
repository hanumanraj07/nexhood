export const landingData = {
    features: [
        {
            id: 'neighborhood',
            title: 'Smart Neighborhoods',
            description: 'Go beyond basic demographics. NexHood provides deep-dive analytics into community health, safety trends, and future development permits. Understand the heartbeat of your next potential home before you visit.',
            image: '/src/assets/SmartNeighborhood.png',
            stats: [
                { label: 'Safety Index', value: '94/100' },
                { label: 'Green Space', value: '22%' },
                { label: 'Walk Mobility', value: 'High' }
            ]
        },
        {
            id: 'map',
            title: 'Spatial Intelligence',
            description: 'Our interactive map overlays multi-source municipal data. Track crime patterns, school district performance, and property value projections in a single, fluid interface designed for clarity.',
            image: '/src/assets/Map.png',
            highlights: ['Heat Maps', 'Zoning Overlays', 'Trend Projection']
        },
        {
            id: 'parking',
            title: 'Dynamic Parking Insights',
            description: 'Stop guessing about vehicle logistics. NexHood analyzes historical parking availability, permit requirements, and upcoming municipal parking projects to ensure your move is seamless.',
            image: '/src/assets/SmartParking.png',
            stats: [
                { label: 'Avg Availability', value: '68%' },
                { label: 'Permit Wait', value: '< 2 wks' }
            ]
        }
    ],
    testimonials: [
        {
            initials: "MT",
            color: "#2a9d8f",
            name: "Marcus Thornton",
            role: "Real Estate Developer",
            quote: "NexHood gave us the clarity to pass on a trendy area that had poor long-term infrastructure planning. It saved us hundreds of thousands."
        },
        {
            initials: "SC",
            color: "#e07b54",
            name: "Sarah Chen",
            role: "Homeowner",
            quote: "As a first-time buyer, the sheer amount of data was overwhelming. The Scorecards simplified everything into a narrative I could understand."
        },
        {
            initials: "JV",
            color: "#6c63ff",
            name: "Julian Vose",
            role: "Portfolio Manager",
            quote: "The API documentation and data methodology are best-in-class. We've integrated NexHood insights directly into our portfolio dashboard."
        }
    ],
    stats: [
        { value: "A+", label: "SAFETY" },
        { value: "94", label: "WALKSCORE" },
        { value: "Top 5%", label: "EDUCATION" }
    ],
    historicalData: [
        { value: 30 },
        { value: 45 },
        { value: 35 },
        { value: 55 },
        { value: 48 },
        { value: 60 },
        { value: 52 }
    ]
};
