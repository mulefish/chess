

class Cell:
    def __init__(self, id, rc):
        self.id = id
        self.rc = rc
        self.kind = None
        self.color = None
        self.piece_id = None
        self.highlighted = False

    def set_piece(self, piece):
        if piece:
            self.piece_id = piece.id
            self.kind = piece.kind
            self.color = piece.color
        else:
            self.piece_id = None
            self.kind = None
            self.color = None

def setup_board():
    new_board = []
    for row in range(8):
        row_array = []
        for col in range(8):
            rc = f"{row}-{col}"
            id = row * 8 + col + 1
            cell = Cell(id, rc)
            row_array.append(cell)
        new_board.append(row_array)
    return new_board

if __name__ == '__main__':
    print("Self test")
    x = setup_board() 
    print(x)    