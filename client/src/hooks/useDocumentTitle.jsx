import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    // We append the brand name automatically for consistency
    document.title = `${title} | Aama Shishu Sewa`;
  }, [title]);
};

export default useDocumentTitle;