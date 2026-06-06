import React from 'react'

// Renders the per-word dictionary breakdown (top 3 results for each word).
// Used during translation loading (Search.js) and in the completed translation
// result (TranslationResult.js) so both surfaces look identical.
//
// Props:
//   wordResults: [{ word, results: [item, ...], loading? }]
//   eastfont:    Syriac font class to apply to the .word-east spans
//   heading:     Optional override for the section heading (defaults to "Word-by-word")
function WordBreakdown(props) {
  var wordResults = props.wordResults || [];
  if (wordResults.length === 0) return null;

  var eastfont = props.eastfont || 'east';
  var heading = props.heading || 'Word-by-word';

  return (
    <div className='word-breakdown'>
      <div className='word-breakdown-heading'>{heading}</div>
      {wordResults.map(function(wr) {
        var results = wr.results || [];
        return (
          <div className='word-section' key={wr.word}>
            <div className='word-section-header'>
              <a href={'/word/' + wr.word} className='word-section-title'>{wr.word}</a>
              <span className='word-section-count'>
                {wr.loading
                  ? 'loading…'
                  : (results.length > 0
                      ? results.length + ' match' + (results.length > 1 ? 'es' : '')
                      : 'no match')}
              </span>
            </div>
            {results.length > 0 ? (
              <ul className='word-section-list'>
                {results.map(function(item, i) {
                  var def = (item && item.definition) || {};
                  return (
                    <li className='word-section-item' key={i}>
                      <span className={'word-east ' + eastfont}>{def.east}</span>
                      {def.phonetic && <span className='word-phonetic'>{def.phonetic}</span>}
                      {def.english_short && <span className='word-gloss'>{def.english_short}</span>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              !wr.loading && <div className='word-section-empty'>No dictionary entry found</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default WordBreakdown
