// Utility function to extract keywords from text
export const extractKeywords = (text: string): string[] => {
  // Basic keyword extraction - in a real implementation, this would be more sophisticated
  const words = text.toLowerCase().split(/\s+/);
  
  // Filter out common words and keep only unique technical terms, skills, etc.
  const commonWords = [
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 
    'about', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may',
    'might', 'must', 'of', 'from', 'by', 'as', 'if', 'then', 'that', 'this', 'these',
    'those', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'what'
  ];
  
  // Keep only words with 3 or more characters and remove common words
  const filteredWords = words.filter(word => 
    word.length >= 3 && 
    !commonWords.includes(word) &&
    !/^\d+$/.test(word) // Remove numbers
  );
  
  // Get unique words
  const uniqueWords = Array.from(new Set(filteredWords));
  
  // Return the top 20 keywords or all if less than 20
  return uniqueWords.slice(0, 20);
};
