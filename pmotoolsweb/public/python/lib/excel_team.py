__author__ = 'asia'


import xlsxwriter
import datetime
import io
import re
import html

glNumberOfWraps = 8
glColWidth = []


class ExcelReport (object):

    def __init__(self, workbook_name, worksheet_name):
        self.output = io.BytesIO()
        self.workbook = xlsxwriter.Workbook(self.output, {'in_memory': True})
        self.worksheet = self.workbook.add_worksheet(worksheet_name)

        self.write_to_row = 0
        self.write_to_col = 0
        # self.worksheet.set_column(0, 0, 40)
        # self.worksheet.set_column(6, 6, 80)

        self._configure_lane_format()
        self._configure_lane_currency_format()
        self._configure_lane_percent_format()
        self._configure_wrap_format()
        self._configure_risk_format()
        self._configure_header_format()
        self._configure_currency_format()
        self._configure_percent_format()
        self.sponsors_dict = {}
        self.params_dict = {}

    def __enter__(self):
        return self


    def close(self):
        self._configure_cols_width()
        self.workbook.close()
        self.output.seek(0)
        return self.output.getvalue()


    def _configure_cols_width (self):
        global glNumberOfWraps
        global glColWidth
        for i in range(glNumberOfWraps):
            self.worksheet.set_column(i, i, min(glColWidth[i], 100))


    def _configure_lane_format (self):
        self._format_lane = self.workbook.add_format()
        self._format_lane.set_bg_color('#c0c0c0')


    def _configure_lane_currency_format (self):
        self._format_lane_currency= self.workbook.add_format()
        self._format_lane_currency.set_bg_color('#c0c0c0')
        self._format_lane_currency.set_num_format(0x03)


    def _configure_lane_percent_format (self):
        self._format_lane_percent = self.workbook.add_format()
        self._format_lane_percent.set_bg_color('#c0c0c0')
        self._format_lane_percent.set_num_format(0x0a)


    def _configure_wrap_format (self):
        self._format_wrap = self.workbook.add_format()
        self._format_wrap.set_text_wrap()


    def _configure_risk_format (self):
        self._format_risk_high_num = self.workbook.add_format()
        self._format_risk_high_num.set_bg_color('#ff6666')
        self._format_risk_high_num.set_num_format(0x03)
        self._format_risk_high = self.workbook.add_format()
        self._format_risk_high.set_bg_color('#ff6666')

        self._format_risk_medium_num = self.workbook.add_format()
        self._format_risk_medium_num.set_bg_color('#ffff00')
        self._format_risk_medium_num.set_num_format(0x03)
        self._format_risk_medium = self.workbook.add_format()
        self._format_risk_medium.set_bg_color('#ffff00')


    def _configure_header_format (self):
        self._format_header = self.workbook.add_format()
        self._format_header.set_bg_color('black')
        self._format_header.set_font_color('white')
        self._format_header.set_font_size (12)

    def _configure_currency_format(self):
        self._format_currency = self.workbook.add_format()
        self._format_currency.set_num_format(0x03)

    def _configure_percent_format(self):
        self._format_percent = self.workbook.add_format()
        self._format_percent.set_num_format(0x0a)


    def _reset_cnt (self, lastCell=False):
        if lastCell == True:
            self.write_to_row += 1
            self.write_to_col = 0
        else:
            self.write_to_col += 1


    def _write_header (self):
        global glNumberOfWraps
        global glColWidth

        headers = ["Sponsor name", "Business initiative", "Description", "Estimated cost"]
        glNumberOfWraps = len(headers)

        glColWidth = [len(headers[x]) for x in range(glNumberOfWraps)]

        for i, elem in enumerate(headers):
            self._write_cell(i, elem, self._format_header)
        self._write_cell(0, "", None, True)


    def _write_cell(self, position, text, cell_format=None, lastCell=False):
        global glColWidth
        glColWidth[position] = max(glColWidth[position], len(str(text)))
        if isinstance(text, int):
            self.worksheet.write_number(self.write_to_row, self.write_to_col, int(text), cell_format)
        elif isinstance(text, float):
            self.worksheet.write_number(self.write_to_row, self.write_to_col, float(text), cell_format)
        else:
            self.worksheet.write_string(self.write_to_row, self.write_to_col, text, cell_format)
        self._reset_cnt (lastCell)


    def _write_merged_cell(self, text, mergeCount, cell_format=None, lastCell=False):
        self.worksheet.merge_range(self.write_to_row, self.write_to_col, self.write_to_row,
                                    self.write_to_col + mergeCount - 1, text, cell_format)
        self._reset_cnt (lastCell)

    def initReport (self, sponsors_dict, params_dict):
        self.sponsors_dict = sponsors_dict
        self.params_dict = params_dict
        self._write_header()


    def writeSingleLane (self, lane):
        global glNumberOfWraps
        next_lane = lane.getNextLanes()
        if next_lane is not None:
            self._write_merged_cell (lane.parent_lane.title, glNumberOfWraps, self._format_lane, True)

    def laneBreak (self):
        self._write_cell(0, "", None, True)


    def writeTeam (self, team_name):
        global glNumberOfWraps
        self._write_merged_cell (team_name, glNumberOfWraps, self._format_lane, True)


    def writeSponsor (self, sponsor_name):
        global glNumberOfWraps
        self._write_merged_cell(self.sponsors_dict.get(sponsor_name, ""), glNumberOfWraps, self._format_lane, True)


    def getInCurrency(self, value):
        baseRate = int(self.params_dict["report_base_rate"])

        if value is not None:
            return value * baseRate
        return None


    def writeCard (self, card):

        self._write_cell(0, self.writeSponsor(card.extended_data.sponsor_name))
        self._write_cell(1, card.title)

        strDescription = re.sub("<.*?>", " ", card.description)
        strDescription = html.unescape(strDescription)
        self._write_cell(2, strDescription)

        self._write_cell(3, self.getInCurrency(card.size), self._format_currency)

        self._write_cell(0, "", None, True)


    def writeSummary (self, total, label):
            self._write_cell(0, label, self._format_lane)
            self._write_cell(1, "", self._format_lane)
            self._write_cell(2, "", self._format_lane)
            self._write_cell(3, self.getInCurrency(total), self._format_lane_currency)
            self._write_cell(0, "", None, True)


    def getMaxSize (self, card_size, taskboard_size):
        if card_size is not None and taskboard_size is not None:
            return max(card_size, taskboard_size)
        if card_size is not None:
            return card_size
        return taskboard_size
