'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
  onMethodClick?: (methodName: string) => void;
}

export default function MermaidDiagram({ chart, className = '', onMethodClick }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [diagramId] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose', // Required for click events
    });

    // Render the diagram
    const renderDiagram = async () => {
      try {
        // Clear previous SVG and show loading
        setSvg('');
        setIsLoading(true);
        
        // Generate unique ID for each render
        const uniqueId = `${diagramId}-${Date.now()}`;
        
        const { svg } = await mermaid.render(uniqueId, chart);
        setSvg(svg);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart, diagramId]);

  // Add click handlers to methods after SVG is rendered
  useEffect(() => {
    if (!svg || !containerRef.current || !onMethodClick) {
      console.log('Click handler setup skipped:', { hasSvg: !!svg, hasContainer: !!containerRef.current, hasCallback: !!onMethodClick });
      return;
    }

    // Use longer delay and check multiple times
    const attemptSetup = (attempt = 1) => {
      console.log(`Attempt ${attempt}: Setting up click handlers...`);
      console.log('Container:', containerRef.current);
      console.log('Container children:', containerRef.current?.children.length);
      
      // Query for text elements within the SVG
      const svgElement = containerRef.current?.querySelector('svg');
      console.log('SVG element found:', !!svgElement);
      
      if (!svgElement) {
        if (attempt < 5) {
          console.log('SVG not found yet, retrying...');
          setTimeout(() => attemptSetup(attempt + 1), 200);
        } else {
          console.log('Failed to find SVG after 5 attempts');
        }
        return;
      }
      
      // Look for text in both SVG text elements and HTML spans
      const textElements = svgElement.querySelectorAll('text');
      const spanElements = svgElement.querySelectorAll('span');
      const allTextElements = [...Array.from(textElements), ...Array.from(spanElements)];
      
      console.log('Found text elements:', textElements.length);
      console.log('Found span elements:', spanElements.length);
      console.log('Total text-like elements:', allTextElements.length);
      
      if (allTextElements.length === 0 && attempt < 5) {
        console.log('No text elements yet, retrying...');
        setTimeout(() => attemptSetup(attempt + 1), 200);
        return;
      }
      
      let methodCount = 0;
      allTextElements.forEach((el, index) => {
        const text = el.textContent?.trim() || '';
        if (index < 30) console.log(`Text ${index}:`, text); // Log first 30
        
        // Check if it looks like a method (contains parentheses)
        if (text.includes('(') && text.includes(')')) {
          methodCount++;
          console.log('Found method:', text);
          
          // Make it visually clickable (works for both SVG text and HTML spans)
          el.style.cursor = 'pointer';
          el.style.fill = '#2563eb'; // for SVG text
          el.style.color = '#2563eb'; // for HTML spans
          el.style.textDecoration = 'underline';
          el.style.fontWeight = '600';
          
          // Add hover effect
          el.addEventListener('mouseenter', () => {
            el.style.fill = '#1d4ed8'; // darker blue for SVG
            el.style.color = '#1d4ed8'; // darker blue for HTML
          });
          
          el.addEventListener('mouseleave', () => {
            el.style.fill = '#2563eb'; // back to normal blue for SVG
            el.style.color = '#2563eb'; // back to normal blue for HTML
          });
          
          const clickHandler = (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Method clicked:', text);
            onMethodClick(text);
          };
          
          el.addEventListener('click', clickHandler);
        }
      });
      
      console.log('Total methods made clickable:', methodCount);
    };
    
    // Start the first attempt after a short delay
    const timer = setTimeout(() => attemptSetup(1), 100);
    
    return () => clearTimeout(timer);
  }, [svg, onMethodClick]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-semibold">Error rendering diagram:</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (isLoading || !svg) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading diagram...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
