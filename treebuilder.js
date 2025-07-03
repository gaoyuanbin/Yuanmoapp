export function buildTree(rows: string[][]) {
  const tree: any = {};

  rows.forEach(([path, english, chinese]) => {
    if (!path) return;

    const parts = path.split('.');
    let node = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!node[part]) node[part] = {};

      if (i === parts.length - 1) {
        node[part] = {
          _isLeaf: true,
          english,
          chinese,
        };
      }

      node = node[part];
    }
  });

  return tree;
}

