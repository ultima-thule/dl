__author__ = 'asia'


import xlsxwriter

class ExcelReport (object):

    def __init__(self, workbook_name, worksheet_name):
        self.workbook = xlsxwriter.Workbook(workbook_name)
        self.worksheet = self.workbook.add_worksheet(worksheet_name)

        self.write_to_row = 0
        self.write_to_col = 0
        self.worksheet.set_column(0, 1, 40)
        self.worksheet.set_column(4, 5, 40)

        self._configure_lane_format()
        self._configure_wrap_format()
        self._configure_risk_format()
        self._configure_header_format()


    def __enter__(self):
        return self


    def close(self):
        self.workbook.close()


    def _configure_lane_format (self):
        self._format_lane = self.workbook.add_format()
        self._format_lane.set_bg_color('#c0c0c0')


    def _configure_wrap_format (self):
        self._format_wrap = self.workbook.add_format()
        self._format_wrap.set_text_wrap()


    def _configure_risk_format (self):
        self._format_risk_high = self.workbook.add_format()
        self._format_risk_high.set_bg_color('#ff6666')
        self._format_risk_medium = self.workbook.add_format()
        self._format_risk_medium.set_bg_color('#ffff00')


    def _configure_header_format (self):
        self._format_header = self.workbook.add_format()
        self._format_header.set_bg_color('black')
        self._format_header.set_font_color('white')
        self._format_header.set_font_size (16)

    def _reset_cnt (self, lastCell=False):
        if lastCell == True:
            self.write_to_row += 1
            self.write_to_col = 0
        else:
            self.write_to_col += 1


    def _write_header (self):
        headers = ["Type", "Business initiative", "Actual cost", "Estimated cost",
                   "Budget status", "Planned release date", "Release status", "Risks & notes"]
        for i in headers:
            self._write_cell(i, self._format_header)
        self._write_cell("", None, True)


    def _write_cell(self, text, cell_format=None, lastCell=False):
        self.worksheet.write_string(self.write_to_row, self.write_to_col, text, cell_format)
        self._reset_cnt (lastCell)


    def _write_merged_cell(self, text, mergeCount, cell_format=None, lastCell=False):
        self.worksheet.merge_range(self.write_to_row, self.write_to_col, self.write_to_row,
                                    self.write_to_col + mergeCount - 1, text, cell_format)
        self._reset_cnt (lastCell)

    def initReport (self):
        self._write_header()


    def writeSingleLane (self, lane):
        next_lane = lane.getNextLanes()
        if next_lane is not None:
            self._write_merged_cell (lane.parent_lane.title, 8, self._format_lane, True)

    def laneBreak (self):
        self._write_cell("", None, True)


    def writeSingleCard (self, card):
            self._write_cell("") #type
            self._write_cell(card.title, self._format_wrap)
            self._write_cell(str(card.task_board_completed_card_size), self._format_wrap)
            self._write_cell(str(card.task_board_total_size), self._format_wrap)
            self._write_cell("") #budget status
            self._write_cell(card.due_date)
            self._write_cell("") #release status

            if card.is_blocked:
                self._write_cell(card.block_reason, self._format_risk_high)
            else:
                if (len(card.comments) > 0):
                    if card.type.name ==  'Progress: Risk identified':
                        riskFormat = self._format_risk_medium
                    elif card.type.name ==  'Progress: High risk':
                        riskFormat = self._format_risk_high
                    self._write_cell(card.comments[0].text, riskFormat)
                else:
                    self._write_cell("")
            self._write_cell("", None, True)


    def writeTeam (self, team):
        self._write_merged_cell (team.name, 8, self._format_lane, True)

    def writeCard (self, card):
            self._write_cell("") #type
            self._write_cell(card.title, self._format_wrap)
            self._write_cell(str(card.taskboard_completed_card_size), self._format_wrap)
            self._write_cell(str(card.taskboard_total_size), self._format_wrap)
            self._write_cell("") #budget status
            if card.due_date is not None:
                self._write_cell(card.due_date.strftime("%Y/%m/%d"))
            else:
                self._write_cell("")
            self._write_cell("") #release status

            if card.is_blocked:
                self._write_cell(card.block_reason, self._format_risk_high)
            else:
                comments = card.comments
                if (len(comments) > 0):
                    if card.type_name ==  'Progress: Risk identified':
                        riskFormat = self._format_risk_medium
                    elif card.type_name ==  'Progress: High risk':
                        riskFormat = self._format_risk_high
                    self._write_cell(card.comments[0].text, riskFormat)
                else:
                    self._write_cell("")
            self._write_cell("", None, True)
