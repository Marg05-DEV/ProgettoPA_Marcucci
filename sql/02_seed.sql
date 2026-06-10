-- seeding della tabella users

INSERT INTO public.users (username, email, password, is_admin, qty_token) VALUES
('admin', 'admin@test.com', '$2a$12$.Ip.WvdkJ.Np86lzAJMam.vaA.15fUwTnC6Sya1Gu8Pdj4XuczHky', TRUE, 300), -- password: #Admin123
('user1', 'user1@test.com', '$2a$12$HFCweKN/9PdVVlEoWnn4n.0Vh4Lih98CRBQNGIiIMarBN7M8DMe5C', FALSE, 300), -- password: #User123
('user2', 'user2@test.com', '$2a$12$g/pqgoxTqNtqlQdC3fwcUObwi/41syhUDoeEXXlJuQIArZ5Ip6.KW', FALSE, 300), -- password: #User456
('user3', 'user3@test.com', '$2a$12$bXviI2TfJdtGAXky54Hs.eUX5YulvQGQ1puhZoDyrV97MUkZsJvA.', FALSE, 0); -- password: #User789

-- seeding della tabella graphs

INSERT INTO public.graphs (user_id, name, description, cost) VALUES
(2, 'Graph 1', 'Graph created by user1', 2.4), -- 8 nodi e 16 archi => costo = n_nodi * 0.20 + n_archi * 0.05 = 2.4
(3, 'Graph 2', 'Graph created by user2', 2.4);   


-- seeding della tabella edges

-- seeding degli archi di 'Graph 1' (graph_id = 1)
INSERT INTO public.edges (graph_id, start_node, end_node, weight) VALUES
(1, 'A', 'B', 4),
(1, 'A', 'C', 2),
(1, 'B', 'C', 5),
(1, 'B', 'D', 10),
(1, 'C', 'E', 3),
(1, 'D', 'F', 7),
(1, 'E', 'D', 4),
(1, 'E', 'F', 8),
(1, 'F', 'G', 2),
(1, 'G', 'H', 6),
(1, 'H', 'F', 3),
(1, 'D', 'G', 5),
(1, 'B', 'E', 6),
(1, 'C', 'D', 8),
(1, 'A', 'E', 9),
(1, 'G', 'D', 4);

-- seeding degli archi di 'Graph 2' (graph_id = 2)
INSERT INTO public.edges (graph_id, start_node, end_node, weight) VALUES
(2, 'a', 'b', 3),
(2, 'a', 'c', 7),
(2, 'b', 'd', 2),
(2, 'b', 'e', 5),
(2, 'c', 'e', 1),
(2, 'd', 'f', 4),
(2, 'e', 'f', 6),
(2, 'e', 'g', 3),
(2, 'f', 'h', 2),
(2, 'g', 'h', 4),
(2, 'c', 'd', 9),
(2, 'a', 'd', 8),
(2, 'b', 'c', 6),
(2, 'd', 'g', 5),
(2, 'f', 'g', 3),
(2, 'h', 'e', 7);


-- seeding della tabella update_logs

-- seeding delle modifiche agli archi per 'Graph 1'
INSERT INTO public.update_logs (requested_by, edge_id, status, old_weight, new_weight, resolved_by, resolved_at) VALUES
(2, 1, 'pending', 4, 6.5, NULL, NULL),
(2, 2, 'approved', 2.5, 2.0, 1, '2026-06-09 10:00:00'),
(2, 3, 'approved', 5.5, 5.0, 1, '2026-06-09 11:30:00');