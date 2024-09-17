class Box:
    def __init__(self, box_id, length, width, height):
        self.box_id = box_id
        self.length = length
        self.width = width
        self.height = height

def calculate_volume(box):
    # testing
    # print(f"{box.length}, {box.width}, {box.height}")
    return box.length * box.width * box.height