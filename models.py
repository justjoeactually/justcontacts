from app import db

class Contact(db.Model):
    """ 
    Create an Contact table
    """

    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(60), index=True)
    last_name = db.Column(db.String(60), index=True)
    dob = db.Column(db.Date, index=True)
    phone = db.Column(db.String(60), index=True)
    zip = db.Column(db.String(60), index=True)
    #user_id = db.Column(db.Integer, foreign_key(user.id), index=True)

    def get_id(self):
        try:
            return text_type(self.id)
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')

    def __eq__(self, other):
        if isinstance(other, Employee):
            return self.get_id() == other.get_id()
        return NotImplemented

    def __ne__(self, other):
        equal = self.__eq__(other)
        if equal is NotImplemented:
            return NotImplemented
        return not equal

    def __repr__(self):
        return '<Contact: {}>'.format(self.first_name + ' ' + self.last_name)


def load_user(user_id):
    return Contact.query.get(int(user_id))

