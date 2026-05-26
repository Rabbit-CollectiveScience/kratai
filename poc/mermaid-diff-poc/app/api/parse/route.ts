import { NextRequest, NextResponse } from 'next/server';
import { codeParser } from '@/lib/codeParser';

export async function POST(request: NextRequest) {
  try {
    const { code, fileName } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    console.log('[API /parse] Parsing file:', fileName);
    console.log('[API /parse] Code length:', code.length);

    // Parse the code
    const classes = codeParser.parseTypeScript(code, fileName || 'temp.ts');

    console.log('[API /parse] Classes found:', classes.length);
    if (classes.length > 0) {
      console.log('[API /parse] First class:', classes[0].name);
      console.log('[API /parse] Methods in first class:', classes[0].methods.length);
      classes[0].methods.forEach((m, i) => {
        console.log(`[API /parse]   Method ${i}: ${m.name}, body length: ${(m.body || '').length}`);
      });
    }

    // Generate class diagram
    const classDiagram = classes.length > 0 
      ? codeParser.generateClassDiagram(classes)
      : '';

    return NextResponse.json({
      classes,
      classDiagram,
    });
  } catch (error) {
    console.error('[API /parse] Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse code', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
