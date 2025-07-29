-- Supabase Database Schema for Mindmapflux
-- Run these commands in your Supabase SQL editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your_jwt_secret_here';

-- Articles table for content management
CREATE TABLE articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_description TEXT,
    keywords TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured_image TEXT,
    author VARCHAR(100) DEFAULT 'Mindmapflux Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0
);

-- Mind maps table for storing user-generated content
CREATE TABLE mind_maps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL, -- Store mind map data as JSON
    user_session VARCHAR(255), -- Anonymous session tracking
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 0
);

-- Article views tracking for analytics
CREATE TABLE article_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    user_session VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mind map usage tracking
CREATE TABLE mind_map_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255),
    action VARCHAR(50), -- 'create', 'edit', 'export', 'view'
    mind_map_id UUID REFERENCES mind_maps(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_mind_maps_session ON mind_maps(user_session);
CREATE INDEX idx_article_views_article_id ON article_views(article_id);
CREATE INDEX idx_mind_map_usage_session ON mind_map_usage(session_id);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mind_maps_updated_at BEFORE UPDATE ON mind_maps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_map_usage ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public articles are viewable by everyone" ON articles
    FOR SELECT USING (status = 'published');

-- Public access for mind maps
CREATE POLICY "Public mind maps are viewable by everyone" ON mind_maps
    FOR SELECT USING (is_public = true);

-- Insert sample articles for SEO
INSERT INTO articles (title, slug, content, excerpt, meta_description, keywords, status, published_at) VALUES
(
    'Business Ideation Techniques: 15 Methods for Innovative Thinking',
    'business-ideation-techniques',
    '# Business Ideation Techniques: 15 Methods for Innovative Thinking

Business ideation is the creative process of generating, developing, and communicating new business ideas. Whether you''re launching a startup, developing new products, or solving complex business challenges, effective ideation techniques can transform your approach to innovation and problem-solving.

## What is Business Ideation?

Business ideation is the systematic process of creating original ideas that can be developed into viable business opportunities. It combines creative thinking with strategic analysis to identify market gaps, solve customer problems, and create value propositions that drive business growth.

## Top 15 Business Ideation Techniques

### 1. Mind Mapping
Create visual representations of ideas and their connections. Start with a central business challenge and branch out into related concepts, solutions, and opportunities.

### 2. SCAMPER Method
- **S**ubstitute: What can be substituted?
- **C**ombine: What can be combined?
- **A**dapt: What can be adapted?
- **M**odify: What can be modified?
- **P**ut to other uses: How else can this be used?
- **E**liminate: What can be eliminated?
- **R**everse: What can be reversed or rearranged?

### 3. Brainstorming Sessions
Generate ideas in group settings with these rules:
- No criticism during idea generation
- Encourage wild and unusual ideas
- Build on others'' ideas
- Focus on quantity over quality initially

### 4. Customer Journey Mapping
Map your customer''s experience to identify pain points and opportunities for innovation at each touchpoint.

### 5. Competitor Analysis
Study successful competitors and identify gaps in their offerings that your business could fill.

### 6. Six Thinking Hats
Use Edward de Bono''s method:
- White Hat: Facts and information
- Red Hat: Emotions and feelings
- Black Hat: Caution and critical thinking
- Yellow Hat: Optimism and benefits
- Green Hat: Creativity and alternatives
- Blue Hat: Process and control

### 7. Problem-Solution Fit Canvas
Systematically explore problems and potential solutions to ensure market viability.

### 8. Trend Analysis
Research emerging trends in technology, society, and your industry to identify future opportunities.

### 9. Assumption Mapping
List and challenge assumptions about your market, customers, and business model.

### 10. Design Thinking Process
Follow the five stages: Empathize, Define, Ideate, Prototype, and Test.

### 11. Business Model Canvas Exploration
Use the nine building blocks to explore different business model possibilities.

### 12. Stakeholder Mapping
Identify all stakeholders and explore how your business can create value for each group.

### 13. Resource-Based Ideation
Start with available resources and explore what unique value you can create.

### 14. Constraint-Based Thinking
Add artificial constraints to force creative solutions within limitations.

### 15. Future Scenario Planning
Imagine different future scenarios and identify business opportunities in each.

## Implementing Ideation in Your Business

### Create an Innovation Culture
- Encourage experimentation and risk-taking
- Provide time and resources for ideation activities
- Celebrate both successes and intelligent failures
- Foster cross-functional collaboration

### Set Up Ideation Sessions
- Define clear objectives and scope
- Include diverse team members
- Use multiple techniques in combination
- Document all ideas for future evaluation

### Evaluate and Prioritize Ideas
- Use frameworks like Impact vs. Effort matrices
- Consider market size and competition
- Assess resource requirements
- Test assumptions with minimum viable products

## Common Ideation Mistakes to Avoid

1. **Premature Evaluation:** Don''t judge ideas during the generation phase
2. **Groupthink:** Encourage diverse perspectives and dissenting views
3. **Analysis Paralysis:** Balance thorough analysis with action
4. **Resource Constraints:** Don''t limit ideas based on current resources
5. **Single Method Reliance:** Use multiple ideation techniques for better results

## Conclusion

Effective business ideation requires systematic approaches, diverse perspectives, and the right environment for creativity to flourish. By combining multiple techniques and creating processes that support innovation, businesses can consistently generate ideas that drive growth and competitive advantage.

Remember that ideation is just the beginning - the real value comes from executing promising ideas and iterating based on market feedback.',
    'Discover 15 powerful business ideation techniques to generate innovative ideas and solve complex challenges. Learn mind mapping, SCAMPER, design thinking, and more proven methods.',
    'Master business ideation with 15 proven techniques including mind mapping, SCAMPER method, design thinking, and brainstorming. Generate innovative ideas for business growth.',
    'business ideation, creative thinking, innovation techniques, mind mapping, SCAMPER method, design thinking, brainstorming, business innovation',
    'published',
    NOW()
),
(
    'Creative Thinking Methods: Unlock Your Innovation Potential',
    'creative-thinking-methods',
    '# Creative Thinking Methods: Unlock Your Innovation Potential

Creative thinking is the ability to generate original, innovative solutions to problems and challenges. In today''s rapidly changing business environment, creative thinking skills are essential for success, competitive advantage, and personal growth.

## Understanding Creative Thinking

Creative thinking involves breaking away from traditional thought patterns and exploring new possibilities. It combines imagination with practical application to generate ideas that are both novel and useful.

## 12 Powerful Creative Thinking Methods

### 1. Lateral Thinking
Developed by Edward de Bono, lateral thinking involves approaching problems from unexpected angles and challenging conventional assumptions.

### 2. Analogical Thinking
Draw parallels between seemingly unrelated concepts to generate new insights and solutions.

### 3. Reverse Thinking
Start with the opposite of what you want to achieve and work backwards to find innovative approaches.

### 4. Random Word Technique
Use random words as stimuli to trigger new ideas and associations.

### 5. What If Analysis
Explore hypothetical scenarios by asking "What if..." questions.

### 6. Metaphorical Thinking
Use metaphors and analogies to reframe problems and discover new solutions.

### 7. Perspective Shifting
View problems from different stakeholder perspectives or time frames.

### 8. Constraint Addition
Add artificial limitations to force creative problem-solving.

### 9. Idea Morphing
Start with existing ideas and systematically modify or combine them.

### 10. Visual Thinking
Use drawings, diagrams, and visual representations to explore ideas.

### 11. Storytelling Method
Create narratives around problems and solutions to uncover new insights.

### 12. Biomimicry
Learn from nature''s solutions to create innovative human applications.

## Building Creative Thinking Skills

### Environmental Factors
- Create spaces that inspire creativity
- Minimize distractions and interruptions
- Encourage playfulness and experimentation
- Provide diverse stimuli and resources

### Personal Practices
- Practice daily creative exercises
- Expose yourself to diverse experiences
- Question assumptions regularly
- Embrace failure as learning opportunity

### Team Techniques
- Use structured brainstorming methods
- Encourage wild ideas without judgment
- Build on others'' contributions
- Rotate leadership and facilitation roles

## Overcoming Creative Blocks

### Common Barriers
- Fear of failure or judgment
- Perfectionism and self-criticism
- Fixed mindsets and assumptions
- Time pressure and stress
- Lack of diverse inputs

### Breakthrough Strategies
- Change your physical environment
- Take breaks and allow incubation time
- Seek diverse perspectives and feedback
- Use structured creative techniques
- Practice mindfulness and relaxation

## Applications in Business

### Product Development
- Generate innovative product concepts
- Improve existing product features
- Identify new market opportunities
- Design user-centered experiences

### Problem Solving
- Approach challenges from multiple angles
- Find root causes of complex issues
- Develop comprehensive solutions
- Anticipate and prevent problems

### Strategic Planning
- Envision future scenarios
- Identify competitive advantages
- Create unique value propositions
- Design innovative business models

## Measuring Creative Success

### Quantitative Metrics
- Number of ideas generated
- Implementation rate of concepts
- Time to solution development
- Innovation pipeline strength

### Qualitative Indicators
- Originality and uniqueness
- Practical applicability
- Market potential
- Stakeholder enthusiasm

## Conclusion

Creative thinking is a learnable skill that can be developed through practice, the right methods, and supportive environments. By incorporating these techniques into your problem-solving toolkit, you can unlock new levels of innovation and success in both personal and professional contexts.',
    'Master creative thinking with 12 proven methods to unlock innovation potential. Learn lateral thinking, analogical thinking, visual methods, and breakthrough strategies.',
    'Unlock creative thinking potential with 12 powerful methods including lateral thinking, analogical thinking, and visual techniques. Boost innovation and problem-solving skills.',
    'creative thinking, innovation methods, lateral thinking, creative problem solving, innovation techniques, creative skills, business creativity',
    'published',
    NOW()
);
