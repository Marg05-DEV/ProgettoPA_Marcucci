import { Edge } from "../models/Edge";

// creo la lista dei nodi sfruttando la non ripetibilità dei Set
export const getNodes = (edges: Edge[]): Array<string> => {
    const nodesSet = new Set<string>();
    edges.forEach((edge) => {
        nodesSet.add(edge.get("startNode") as string);
        nodesSet.add(edge.get("endNode") as string);
    });
    
    return Array.from(nodesSet);
}